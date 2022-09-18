import React from 'react';
import { render, screen } from '@testing-library/react';
import OverviewScreen from '../../screens/OverviewScreen';
import renderer from 'react-test-renderer';
import { BrowserRouter } from 'react-router-dom';



describe('Overview Screen', () => {

    it('test Snapshot', () => {
        // Arrange
        const component = renderer.create(
            <BrowserRouter>
                <OverviewScreen importedSurvey={{}}/>
            </BrowserRouter>
        );

        // Act
        let tree = component.toJSON();

        // Assert
        expect(tree).toMatchSnapshot();
    
      });
      
})