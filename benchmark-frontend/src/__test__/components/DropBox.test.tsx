import React from 'react';
import '@testing-library/jest-dom'
import renderer from 'react-test-renderer';
import { BrowserRouter } from 'react-router-dom';
import DropBox from '../../components/DropBox';

describe('Test StatusCell Component', () => {
    it('test Snapshot', () => {
        // Arrange
        const component = renderer.create(
            <BrowserRouter>
                <DropBox 
                    header="Company"
                    menuHeader="Company"
                    items={[
                        'iReliability',
                        'Smart CBM',
                        'Smart CBM Enhanced',
                        'Smart CBM Mobile'
                    ]}
                    selectedItem="Smart CBM" />
            </BrowserRouter>
        );

        // Act
        let tree = component.toJSON();

        // Assert
        expect(tree).toMatchSnapshot();
    
      });
      
})

