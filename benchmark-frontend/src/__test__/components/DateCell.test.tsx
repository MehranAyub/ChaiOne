import React from 'react';
import '@testing-library/jest-dom'
import renderer from 'react-test-renderer';
import { BrowserRouter } from 'react-router-dom';
import DateCell from '../../components/DateCell';

describe('Test StatusCell Component', () => {
    it('test Snapshot', () => {
        // Arrange
        const component = renderer.create(
            <BrowserRouter>
                <DateCell />
            </BrowserRouter>
        );

        // Act
        let tree = component.toJSON();

        // Assert
        expect(tree).toMatchSnapshot();
    
      });
      
})

