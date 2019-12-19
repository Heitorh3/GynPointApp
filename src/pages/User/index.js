import React, {Component} from 'react';
import {ActivityIndicator, TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';
import {WebView} from 'react-native-webview';

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

    async componentDidMount() {
        const {navigation} = this.props;
        const user = navigation.getParam('user');
        const {page, per_page, loading} = this.state;

        const response = await api.get(`/users/${user.login}/starred`, {
            params: {
                page,
                per_page,
            },
        });
        this.setState({starts: response.data, page: page + 1});
    }

    onEndReached = async () => {
        const {navigation} = this.props;
        const user = navigation.getParam('user');
        const {per_page, page} = this.state;

        const response = await api.get(`/users/${user.login}/starred`, {
            params: {
                page,
                per_page,
            },
        });

        this.setState({
            starts: [...this.state.starts, ...response.data],
            page: page + 1,
        });
    };

    renderFooter = () => {
        const {loading} = this.state;

        if (!loading) return null;
        return (
            <Loading>
                <ActivityIndicator />
            </Loading>
        );
    };

    handleShowItem = html_url => {
        //console.tron.log(url);
        return (
            <View>
                <WebView source={{uri: html_url}} />;
            </View>
        );
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
                            onPress={() => this.handleShowItem(item.html_url)}>
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
                    onEndReached={() => this.onEndReached()}
                    onEndReachedThreshold={0.1} //10%
                    ListFooterComponent={this.renderFooter}
                />
            </Container>
        );
    }
}
