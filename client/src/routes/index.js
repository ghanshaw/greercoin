import React, { useContext, useMemo } from 'react';

// React-Router
import { Switch, Route } from "react-router-dom";

import AppLayout from 'layout/AppLayout';

import Homepage from 'modules/homepage';
import Topic from 'modules/topic';
import Studier from 'modules/studier';

import { ModalContext } from 'context/ModalContext';
import AuthModal from 'components/modals/AuthModal'

const Routes = (props) => {
    const modalContext = useContext(ModalContext);

    const openAuthModal = () => {
        modalContext.setBody(<AuthModal isAuthenticated={props.isAuthenticated}/>);
        modalContext.setBackgroundClose(false);
        modalContext.setHeight("300px");
        modalContext.setTitle("Welcome to Zapp");
        modalContext.open();
    }

    useMemo(() => {

        if (!props.isAuthenticated) {
            openAuthModal();
        } else if (props.isAuthenticated && modalContext.isVisible) {
            modalContext.close();
        }

    }, [ props.isAuthenticated ]);
    
    return (
        <Switch>
            <Route path="/">
                <Homepage/>
            </Route>
        </Switch>
    )
    
}

export default Routes;