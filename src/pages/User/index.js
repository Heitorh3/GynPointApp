import React, {Component} from 'react';
import {ActivityIndicator, TouchableOpacity} from 'react-native';
import {WebView} from 'react-native-webview';

import PropTypes from 'prop-types';

import api from '../../services/api';
import {
    Container,
    Header,
    Avatar,
    Name,
    Bio,
    Stars,
    Starred,
    OwnerAvatar,
    Info,
    Title,
    Author,
    Loading,
} from './styles';

export default class User extends Component {
    static propTypes = {
        navigation: PropTypes.shape({
            getParam: PropTypes.func,
        }).isRequired,
    };

    static navigationOptions = ({navigation}) => ({
        title: navigation.getParam('user').name,
    });

    state = {
        starts: [],
        page: 1,
        per_page: 15,
        loading: false,
    };

    componentDidMount() {
        this.loadRepositories();
    }

    loadRepositories = async () => {
        const {navigation} = this.props;
        const user = navigation.getParam('user');
        const {page, per_page} = this.state;

        if (this.state.loading) return null;

        this.setState({loading: true});

        const response = await api.get(`/users/${user.login}/starred`, {
            params: {
                page,
                per_page,
            },
        });

        this.setState({
            starts: response.data,
            page: page + 1,
            loading: false,
        });
    };

    onEndReached = async () => {
        this.loadRepositories();
    };

    renderLoading = () => {
        const {loading} = this.state;

        if (!loading) return null;
        return (
            <Loading>
                <ActivityIndicator />
            </Loading>
        );
    };

    handleShowDetailsRepo = html_url => {
        return <WebView originWhitelist={['*']} source={{uri: html_url}} />;
    };

    render() {
        const {navigation} = this.props;
        const {starts} = this.state;
        const user = navigation.getParam('user');

        return (
            <Container>
                <Header>
                    <Avatar source={{uri: user.avatar}} />
                    <Name>{user.name}</Name>
                    <Bio>{user.bio}</Bio>
                </Header>
                <Stars
                    data={starts}
                    keyExtractor={star => String(star.id)}
                    renderItem={({item}) => (
                        <TouchableOpacity
                            onPress={this.handleShowDetailsRepo(item.html_url)}>
                            <Starred>
                                <OwnerAvatar
                                    source={{uri: item.owner.avatar_url}}
                                />
                                <Info>
                                    <Title>{item.name}</Title>
                                    <Author>{item.owner.login}</Author>
                                </Info>
                            </Starred>
                        </TouchableOpacity>
                    )}
                    onEndReached={this.loadRepositories}
                    onEndReachedThreshold={0.1} //10%
                    ListFooterComponent={this.renderLoading}
                />
            </Container>
        );
    }
}
