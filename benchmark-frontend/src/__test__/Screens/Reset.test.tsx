import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Reset from '../../screens/Reset';
import renderer from 'react-test-renderer';
import { BrowserRouter } from 'react-router-dom';



describe('Reset Screen', () => {
    it('should render Recover Password message', () => {
        render( <BrowserRouter><Reset /></BrowserRouter>);
        expect(screen.getByText('Recover Password')).toBeInTheDocument();
    });

    it('should route to login screen ',() => {
        // Arrange
        render( <BrowserRouter>
                    <Reset />
                </BrowserRouter>);
        // Act
        fireEvent.click(screen.getByText('Back to Login'));

        // Assert
        expect(window.location.pathname).toBe('/login');
    })

    it('test Snapshot', () => {
        // Arrange
        const component = renderer.create(
            <BrowserRouter>
                <Reset />
            </BrowserRouter>
        );

        // Act
        let tree = component.toJSON();

        // Assert
        expect(tree).toMatchSnapshot();
    
      });
      
})