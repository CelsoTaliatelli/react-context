import { useEffect, useState } from "react";
import { createContext, useContext } from "react";
import { usePagamentoContext } from "./Pagamento";
import { UsuarioContext } from "./Usuario";

export const CarrinhoContext = createContext();
CarrinhoContext.displayName = 'Carrinho';

export const CarrinhoProvider = ({ children }) => {
    const [carrinho, setCarrinho] = useState([]);
    const [total, setTotal] = useState(0);
    const [quantidade, setQuantidade] = useState(0);

    return(
        <CarrinhoContext.Provider value={{ carrinho, setCarrinho, quantidade, setQuantidade, total, setTotal }}>
            {children}
        </CarrinhoContext.Provider>
    )
}

/***
 * hook customizado
 */
export const useCarrinhoContext = () => {
    const { carrinho, setCarrinho, quantidade, setQuantidade, total, setTotal } = useContext(CarrinhoContext);
    const { saldo, setSaldo } = useContext(UsuarioContext);
    const { formaPagamento } = usePagamentoContext();

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

    const efetuarComprar = () => {
        setCarrinho([]);
        setSaldo(saldoAtual => saldoAtual - total)

    }
 
    useEffect(() => {
        const { novaQuantidade, novoTotal } = carrinho.reduce((contador, produto) => 
            ({
                novaQuantidade: contador.novaQuantidade + produto.quantidade,
                novoTotal: contador.novoTotal + (produto.valor * produto.quantidade)
            }),{
                novaQuantidade:0,
                novoTotal: 0
            });
            console.log(novaQuantidade);
            setQuantidade(novaQuantidade);
            setTotal(novoTotal * formaPagamento.juros);
    }, [carrinho,setQuantidade, setTotal, formaPagamento])

    return { carrinho, setCarrinho, addProduto, removeProduto, quantidade, total, efetuarComprar }
}