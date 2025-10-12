import React from 'react';
import { Tabs, Tab } from 'react-tabs';
import FinancesTab from './tabs/FinancesTab';
import NewsTab from './tabs/NewsTab';
import UpdatesTab from './tabs/UpdatesTab';
import ProfileTab from './tabs/ProfileTab';
import ContactsTab from './tabs/ContactsTab';
import CodeTab from './tabs/CodeTab';
import OnlineTab from './tabs/OnlineTab';

const Dashboard = () => {
    return (
        <div className="bg-gray-800 text-white p-4">
            <Tabs>
                <Tab title="News"><NewsTab /></Tab>
                <Tab title="Updates"><UpdatesTab /></Tab>
                <Tab title="Admin Profile"><ProfileTab /></Tab>
                <Tab title="Business Contacts"><ContactsTab /></Tab>
                <Tab title="Code Database"><CodeTab /></Tab>
                <Tab title="Online"><OnlineTab /></Tab>
                <Tab title="Finances"><FinancesTab /></Tab>
            </Tabs>
        </div>
    );
};

export default Dashboard;