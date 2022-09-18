import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DashboardScreen from '../../screens/DashboardScreen';
import renderer from 'react-test-renderer';
import { BrowserRouter } from 'react-router-dom';



describe('Dashboard Screen', () => {

    beforeEach(() => {

        // @ts-ignore
        fetch.resetMocks();
      });

    it('should render Surveys header', () => {
        render( <BrowserRouter><DashboardScreen /></BrowserRouter>);
        expect(screen.getByText('Surveys')).toBeInTheDocument();
    });

    it('should render Tabs headers', () => {
        render( <BrowserRouter><DashboardScreen /></BrowserRouter>);
        expect(screen.getByText('Awaiting Import')).toBeInTheDocument();
        expect(screen.getByText('Ignored')).toBeInTheDocument();
    });

    it('should render first page', () => {
        render( <BrowserRouter><DashboardScreen /></BrowserRouter>);
        expect(screen.getByText('Surveys')).toBeInTheDocument();
    });

    it('test Snapshot', () => {
        // Arrange
        const component = renderer.create(
            <BrowserRouter>
                <DashboardScreen />
            </BrowserRouter>
        );

        // Act
        let tree = component.toJSON();

        // Assert
        expect(tree).toMatchSnapshot();
    
      });
      
})