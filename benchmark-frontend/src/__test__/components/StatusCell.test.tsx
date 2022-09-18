import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { BrowserRouter } from 'react-router-dom';
import StatusCell from '../../components/StatusCell';



describe('Test StatusCell Component', () => {
    it('test Snapshot', () => {
        // Arrange
        const component = renderer.create(
            <BrowserRouter>
                <StatusCell status={0} />
                <StatusCell status={1} />
                <StatusCell status={2} />
            </BrowserRouter>
        );

        // Act
        let tree = component.toJSON();

        // Assert
        expect(tree).toMatchSnapshot();
    
      });

      it('test label status New', () => {
        // Arrange
        render(
            <BrowserRouter>
               <StatusCell status={0} />
            </BrowserRouter>
        );

        // Act

        // Assert
        expect(screen.getByText('New')).toBeInTheDocument();
    
      });

      it('test label status Open', () => {
        // Arrange
        render(
            <BrowserRouter>
               <StatusCell status={1} />
            </BrowserRouter>
        );

        // Act

        // Assert
        expect(screen.getByText('Open')).toBeInTheDocument();
    
      });

      it('test label status Closed', () => {
        // Arrange
        render(
            <BrowserRouter>
               <StatusCell status={2} />
            </BrowserRouter>
        );

        // Act

        // Assert
        expect(screen.getByText('Closed')).toBeInTheDocument();
    
      });

      it('test label status empty', () => {
        // Arrange
        render(
            <BrowserRouter>
               <StatusCell />
            </BrowserRouter>
        );

        // Act

        // Assert
        expect(screen.queryByTestId('status-label') ).toBeEmptyDOMElement();
    
      });
      
})

