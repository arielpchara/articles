fn hello(name: String) {
    println("{}", param);
}
fn main() {
    let name = "Ariel"
    hello(name.clone())
    println("{}", name); // <-- agora sim 😀, mas tu ocupa duas vezes a memória com o conteúdo da variável name
}