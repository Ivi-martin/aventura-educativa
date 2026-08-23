import { createContext, useState, useContext } from 'react';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
    const [xp, setXp] = useState(0);
    const [level, setLevel] = useState(1);

    const addXp = (amount) => {
        setXp((prev) => prev + amount);
        // Aquí añadiremos la lógica para calcular la subida de nivel
    };

    return (
        <GameContext.Provider value={{ xp, level, addXp }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => useContext(GameContext);