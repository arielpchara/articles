fn hello(name: &String) {
    println("{}", param);
}
fn main() {
    let name = "Ariel"
    hello(&name)
    println("{}", name); // <-- agora sim 😀
}