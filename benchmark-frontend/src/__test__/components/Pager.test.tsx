import React from 'react';
import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { BrowserRouter } from 'react-router-dom';
import Pager from '../../components/Pager';

describe('Test StatusCell Component', () => {
    it('test Snapshot', () => {
        // Arrange
        const component = renderer.create(
            <BrowserRouter>
                <Pager />
            </BrowserRouter>
        );

        // Act
        let tree = component.toJSON();

        // Assert
        expect(tree).toMatchSnapshot();
    
      });

      it('test onclick setTabIndex', () => {
        const totalPage = 4;
        const activePage = 0;
        const setActivePage = jest.fn(() => null);
 
        // Arrange
        render(
            <BrowserRouter>
                <Pager totalPage={totalPage}
                    activePage={activePage}
                    setActivePage={setActivePage} />
            </BrowserRouter>
        );

        // Act
        fireEvent.click(screen.getByText('2'));

        // Assert
        expect(setActivePage).toBeCalledTimes(1);
    
      });
      
})

