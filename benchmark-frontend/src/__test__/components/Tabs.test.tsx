import React from 'react';
import '@testing-library/jest-dom'
import renderer from 'react-test-renderer';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Tabs from '../../components/Tabs';

describe('Test Tabs Component', () => {
    it('test Snapshot', () => {
        const setTabIndex = jest.fn(() => null);
        const tabIndex = 0;
        // Arrange
        const component = renderer.create(
            <BrowserRouter>
                <Tabs tabs={['Awaiting Import', 'Ignored']}
                setTabIndex={setTabIndex}
                tabIndex={tabIndex} />
            </BrowserRouter>
        );

        // Act
        let tree = component.toJSON();

        // Assert
        expect(tree).toMatchSnapshot();
    
      });

      it('test onclick setTabIndex', () => {
        const setTabIndex = jest.fn(() => null);
        const tabIndex = 0;
        // Arrange
        render(
            <BrowserRouter>
                <Tabs tabs={['Awaiting Import', 'Ignored']}
                setTabIndex={setTabIndex}
                tabIndex={tabIndex} />
            </BrowserRouter>
        );

        // Act
        fireEvent.click(screen.getByText('Ignored'));

        // Assert
        expect(setTabIndex).toBeCalledTimes(1);
    
      });
      
})

