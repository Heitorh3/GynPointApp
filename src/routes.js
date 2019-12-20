import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import Main from './pages/Main';
import Repository from './pages/Repository';
import User from './pages/User';

const Routes = createAppContainer(
    createStackNavigator(
        {
            Main,
            User,
            Repository,
        },
        {
            headerLayoutPreset: 'center',
            defaultNavigationOptions: {
                headerStyle: {
                    backgroundColor: '#7159c1',
                },
                headerTintColor: '#FFF',
            },
            headerBackTitleVisible: false,
        }
    )
);

export default Routes;
