import React from 'react';
import { render, screen } from '@testing-library/react';
import ReviewDataScreen from '../../screens/ReviewDataScreen';
import renderer from 'react-test-renderer';
import { BrowserRouter } from 'react-router-dom';



describe('Review Data Screen', () => {

    it('test Snapshot', () => {
        // Arrange
        const component = renderer.create(
            <BrowserRouter>
                <ReviewDataScreen />
            </BrowserRouter>
        );

        // Act
        let tree = component.toJSON();

        // Assert
        expect(tree).toMatchSnapshot();
    
      });
      
})