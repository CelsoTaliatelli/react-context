import { useState } from "react";
import { createContext, useContext } from "react";

export const CarrinhoContext = createContext();
CarrinhoContext.displayName = 'Carrinho';

export const CarrinhoProvider = ({ children }) => {
    const [carrinho, setCarrinho] = useState([]);
    return(
        <CarrinhoContext.Provider value={{ carrinho, setCarrinho }}>
            {children}
        </CarrinhoContext.Provider>
    )
}

/***
 * hook customizado
 */
export const useCarrinhoContext = () => {
    const { carrinho, setCarrinho } = useContext(CarrinhoContext);

    const addProduto = (novoProduto) => {
        const produtoExiste = carrinho.some(itemCarrinho => itemCarrinho.id === novoProduto.id);
        if(!produtoExiste){
          novoProduto.quantidade = 1;
          return setCarrinho(carrinhoAnterior => [...carrinhoAnterior,novoProduto])
        }
    
        setCarrinho(carrinhoAnterior => carrinhoAnterior.map(itemDoCarrinho => {
            if(itemDoCarrinho.id === novoProduto.id) itemDoCarrinho.quantidade += 1
            return itemDoCarrinho;
        }))
        
      }

    return { carrinho, setCarrinho, addProduto }
}