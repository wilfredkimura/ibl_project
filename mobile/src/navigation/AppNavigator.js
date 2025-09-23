import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../context/AuthContext';
import HomeScreen from '../screens/HomeScreen';
import BlogDetailScreen from '../screens/BlogDetailScreen';
import BlogsScreen from '../screens/BlogsScreen';
import EventsScreen from '../screens/EventsScreen';
import LeadersScreen from '../screens/LeadersScreen';
import GalleryScreen from '../screens/GalleryScreen';
import GalleryAlbumsScreen from '../screens/GalleryAlbumsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import AdminUsersScreen from '../screens/admin/AdminUsersScreen';
import AdminBlogsScreen from '../screens/admin/AdminBlogsScreen';
import AdminEventsScreen from '../screens/admin/AdminEventsScreen';
import AdminGalleryScreen from '../screens/admin/AdminGalleryScreen';
import AdminLeadersScreen from '../screens/admin/AdminLeadersScreen';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeMain" component={HomeScreen} options={{ title: 'Home' }} />
      <Stack.Screen name="BlogDetail" component={BlogDetailScreen} options={{ title: 'Blog' }} />
    </Stack.Navigator>
  );
}

function BlogsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="BlogsMain" component={BlogsScreen} options={{ title: 'Blogs' }} />
      <Stack.Screen name="BlogDetail" component={BlogDetailScreen} options={{ title: 'Blog' }} />
    </Stack.Navigator>
  );
}

function GalleryStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="GalleryAlbums" component={GalleryAlbumsScreen} options={{ title: 'Albums' }} />
      <Stack.Screen name="GalleryAlbum" component={GalleryScreen} options={({ route }) => ({ title: route.params?.albumTitle || 'Gallery' })} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} options={{ title: 'Profile' }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Register' }} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { isAdmin } = React.useContext(AuthContext);
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          const iconMap = {
            Home: 'home-variant',
            Blogs: 'post',
            Events: 'calendar',
            Leaders: 'account-group',
            Gallery: 'image-multiple',
            Profile: 'account-circle',
            Admin: 'shield-crown',
          };
          const name = iconMap[route.name] || 'circle';
          return <MaterialCommunityIcons name={name} color={color} size={size} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Blogs" component={BlogsStack} />
      <Tab.Screen name="Events" component={EventsScreen} />
      <Tab.Screen name="Leaders" component={LeadersScreen} />
      <Tab.Screen name="Gallery" component={GalleryStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
      {isAdmin && (
        <Tab.Screen name="Admin" component={AdminTabs} />
      )}
    </Tab.Navigator>
  );
}

const AdminTab = createBottomTabNavigator();
function AdminTabs() {
  return (
    <AdminTab.Navigator>
      <AdminTab.Screen name="Dashboard" component={AdminDashboardScreen} />
      <AdminTab.Screen name="Users" component={AdminUsersScreen} />
      <AdminTab.Screen name="Blogs" component={AdminBlogsScreen} />
      <AdminTab.Screen name="EventsAdmin" component={AdminEventsScreen} options={{ title: 'Events' }} />
      <AdminTab.Screen name="GalleryAdmin" component={AdminGalleryScreen} options={{ title: 'Gallery' }} />
      <AdminTab.Screen name="LeadersAdmin" component={AdminLeadersScreen} options={{ title: 'Leaders' }} />
    </AdminTab.Navigator>
  );
}
