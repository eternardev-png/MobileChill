import React from 'react';
import { Platform } from 'react-native';

export const GlobalStyles = () => {
    if (Platform.OS !== 'web') return null;

    return (
        <style type="text/css">{`
      /* Custom Scrollbar */
      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      ::-webkit-scrollbar-track {
        background: #1a1a1a; 
      }
      ::-webkit-scrollbar-thumb {
        background: #444; 
        border-radius: 4px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: #555; 
      }
      
      /* App Container Fix for Web */
      #root {
        display: flex;
        flex-direction: column;
        height: 100vh;
      }
    `}</style>
    );
};
