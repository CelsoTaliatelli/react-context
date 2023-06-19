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

    const mudarQuantidade = (id, quantidade) => {
        return carrinho.map(itemDoCarrinho => {
            if(itemDoCarrinho.id === id) itemDoCarrinho.quantidade += quantidade
            return itemDoCarrinho;
        })
    }

    const addProduto = (novoProduto) => {
        const produtoExiste = carrinho.some(itemCarrinho => itemCarrinho.id === novoProduto.id);
        if(!produtoExiste){
          novoProduto.quantidade = 1;
          return setCarrinho(carrinhoAnterior => [...carrinhoAnterior,novoProduto])
        }
        setCarrinho(mudarQuantidade(novoProduto.id,1));
        
      }

    const removeProduto = (id) => {
        const produto = carrinho.find(itemCarrinho => itemCarrinho.id === id);
        const ehUltimo = produto.quantidade === 1;
        if(ehUltimo){
            return setCarrinho(carrinhoAnterior => carrinhoAnterior.filter(
                itemCarrinho => itemCarrinho.id !== id
            ))
        }
        setCarrinho(mudarQuantidade(id,-1));
    }

    return { carrinho, setCarrinho, addProduto, removeProduto }
}