As aventuras no mundo Rust de quem muito programou em JavaScript


Era uma linda manhã de primavera quando …
Não, sei lá quando foi isso, talvez durante um BrazilJS de 1915, como todo bom programador JavaScript em busca de respeito para seu árduo trabalho de lidar com telinhas no navegador, estava lá eu sedento por novidades e eis que me apresentam um caranguejinho sorridente que dizia ser possível executar binários no navegador.

Opa! Agora vai.

Naquele momento o caminho que mais chamava atenção para chegar no tal wasm era utilizando a linguagem de programação Rust, uma linguagem de baixo nível que prometia uma segurança, em termos de falhas, maior que outras linguagens de baixo nível como C ou C++.

E depois de um mísero hello world, eu pensei.

"Tá legal e agora o que eu faço com isso?"

E assim o WebAssembly aparecia na minha vida e mais rápido ainda ele ia embora.

Naquele tempo Internet Explorer, que Deus o tenha, ainda vagava por essas terras e nosso querido caranguejo estava distante de ser algo viável para o mundo real.

E ai fomos nos afastando até que a relação ficou fria e achamos melhor terminar.

Mas o mundo não gira, ele capota!

E passados 129 anos e alguns dias, surge uma oportunidade de fazer uma coisinha, sabe aquele projetinho rápido, só pra testar uma idéia, então precisava ser feito para rodar tanto em windows como linux, que fosse stand alone e essas coisinhas "rápidas".

Então o olho brilhou, o coração bateu forte e o Rust estava lá!

E os caminhos ensolarados e pavimentados se tornaram tortuosos e sombrios.

Mudar o paradigma que anos eu já tinha do JavaScript, para se adaptar no Rust não era tarefa fácil, entender o que era borrowed, ownership, variáveis estáticas, mut, closure, coisas que na primeira impressão até parecem iguais ao JS, mas que tinha diferenças substanciais na hora de programar.

É como você que fala portugues e acha que espanhol é fácil porque tem um monte de coisa parecida, não é.

A primeira barreira foi o Ownership, que significa que quando você passa uma variável como parâmetro para outra função aquela variável deixa de existir no escopo.

Vamos de exemplo:
```rs
fn hello(name: String) {
    println("{}", param);
}
fn main() {
    let name = "Ariel"
    hello(name)
    println("{}", name); // <-- aqui ela não existe mais!
}
```

Como assim eu passo uma variável como parâmetro e eu não posso mais usar ela ?

É, mas tem solução, chama-se borrowed, onde você indica que você está só emprestando a variável.

Assim ó:
```rs
fn hello(name: &String) {
    println("{}", param);
}
fn main() {
    let name = "Ariel"
    hello(&name)
    println("{}", name); // <-- agora sim 😀
}
```

Coloca um "&" no parâmetro na função.

Vai com calma que não termina aí, mas eu não vou entrar em tantos detalhes, vamos focar nas coisas que mais confundem quem programa em JS.

A próxima coisa foi o async/await do rust que funciona de forma parecida mas nada a ver, primeiro que a parte do ownership e borrowed fica mais complexa ainda, já que agora os escopos ou closures, podem ter ciclos de vida diferentes aí não dá pra emprestar uma variável que pode ser utilizada quando a origem dela não existe mais, aí voce começa a clonar os parâmetros, assim:

```rs
fn hello(name: String) {
    println("{}", param);
}
fn main() {
    let name = "Ariel"
    hello(name.clone())
    println("{}", name); // <-- agora sim 😀, mas tu ocupa duas vezes a memória com o conteúdo da variável name
}
```
 
E a última coisa pra ressaltar aqui de diferente é o fato de trabalhar com threads.
A maravilha que é  esse inferno das threads, você feliz com o JavaScript single thread passando variáveis e funções de lá pra cá, sem se preocupar, prometendo um monte de coisa pra todo mundo, e a assincronicidade resolvendo tudo.
No Rust, se você quiser fazer mais de uma coisa ao mesmo tempo vai precisar de threads.
Ja de cara da uma olhada no https://tokio.rs/ que ja te adianta muita coisa, e threads é isso vai te ajudar muito mais dá um baita trabalho bom.

Eu comecei falando de wasm mas nem cheguei nele ainda, e de fato como esse projeto é somente para rodar local, nada de wasm por enquanto.

Mas eu vou falar alguma coisa sobre eu prometo.
