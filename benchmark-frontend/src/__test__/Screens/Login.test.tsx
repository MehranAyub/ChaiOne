import React from 'react';
import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../../screens/Login';
import renderer from 'react-test-renderer';
import { BrowserRouter } from 'react-router-dom';



describe('Test Login Screen', () => {
    it('should render welcome message', () => {
        // Arrange
        render( <BrowserRouter><Login /></BrowserRouter>);

        // Act

        // Assert
        expect(screen.getByText('Welcome!')).toBeInTheDocument();
    });

    it('should route to dashboard screen on submit ',() => {
        // Arrange
        render( <BrowserRouter>
                    <Login setIsUserAuth={() => null}/>
                </BrowserRouter>);
        // Act

        // fill out the form
        fireEvent.change(screen.getByTestId('login-username'), {
            target: {value: 'azureuser'},
        })

        fireEvent.change(screen.getByTestId('login-password'), {
            target: {value: 'mypassword'},
        })

        fireEvent.click(screen.getByTestId('login-signin'));

        // Assert
        expect(window.location.pathname).toBe('/dashboard');
    })

    it('should route to reset screen ',() => {
        // Arrange
        render( <BrowserRouter>
                    <Login setIsUserAuth={() => null}/>
                </BrowserRouter>);
        // Act

        fireEvent.click(screen.getByTestId('login-reset'));

        // Assert
        expect(window.location.pathname).toBe('/reset');
    })

    it('test Snapshot', () => {
        // Arrange
        const component = renderer.create(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        // Act
        let tree = component.toJSON();

        // Assert
        expect(tree).toMatchSnapshot();
    
      });
      
})

