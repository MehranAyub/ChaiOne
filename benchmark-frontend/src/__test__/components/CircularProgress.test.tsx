import React from 'react';
import '@testing-library/jest-dom'
import renderer from 'react-test-renderer';
import { BrowserRouter } from 'react-router-dom';
import CircularProgress from '../../components/CircularProgress';

describe('Test StatusCell Component', () => {
    it('test Snapshot', () => {
        // Arrange
        const component = renderer.create(
            <BrowserRouter>
                <CircularProgress />
            </BrowserRouter>
        );

        // Act
        let tree = component.toJSON();

        // Assert
        expect(tree).toMatchSnapshot();
    
      });
      
})

