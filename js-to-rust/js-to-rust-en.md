Adventures in the Rust World for Someone Well-Versed in JavaScript

It was a beautiful spring morning when...
Well, I don't know when it was exactly, maybe during a BrazilJS event in 1915. Like any good JavaScript programmer in search of respect for their hard work dealing with screens in the browser, there I was, eager for something new, and behold, they introduced me to a smiling little crab that claimed it was possible to run binaries in the browser.

Whoa! This is promising.

At that moment, the most attention-grabbing path to get to that WebAssembly thing was by using the Rust programming language, a low-level language that promised greater safety in terms of vulnerabilities compared to other low-level languages like C or C++.

And after a meager "hello, world," I thought,

"Alright, what do I do with this now?"

And that's how WebAssembly entered my life and left even faster.

Back then, Internet Explorer, may it rest in peace, was still wandering around, and our dear crab was far from being a viable option for the real world.

So, we gradually drifted apart until our relationship turned cold, and we thought it best to break up.

But the world doesn't just spin; it turns upside down!

And after 129 years and some days, an opportunity arose to create something, you know, a quick little project, just to test an idea. It needed to run on both Windows and Linux, be stand-alone, and all those "quick" things.

Then, my eyes sparkled, my heart raced, and Rust was there!

The sunny and paved paths turned into winding and dark ones.

Changing the paradigm I had developed over the years in JavaScript to adapt to Rust was no easy task. Understanding concepts like ownership, borrowed, static variables, mutable variables, closures, things that at first glance might seem similar to JS but had substantial differences in terms of programming.

It's like you speak Portuguese and think Spanish is easy because there are a lot of similarities. It's not.

The first hurdle was ownership, which means that when you pass a variable as a parameter to another function, that variable no longer exists in the current scope.

Let's see an example:

rust
Copy code
fn hello(name: String) {
    println!("{}", param);
}

fn main() {
    let name = "Ariel";
    hello(name);
    println!("{}", name); // <-- it doesn't exist here anymore!
}
What do you mean I pass a variable as a parameter and I can't use it anymore?

But there's a solution, it's called borrowed, where you indicate that you're just lending the variable.

Like this:

rust
Copy code
fn hello(name: &String) {
    println!("{}", param);
}

fn main() {
    let name = "Ariel";
    hello(&name);
    println!("{}", name); // <-- now it works 😀
}
Just add an "&" to the parameter in the function.

But it doesn't end there; I won't go into too many details, let's focus on the things that confuse most people who program in JS.

The next thing was Rust's async/await, which works similarly but is quite different. Firstly, the ownership and borrowed part becomes even more complex, as now scopes or closures can have different lifetimes. You can't lend a variable that may be used when its source no longer exists, so you start cloning parameters like this:

rust
Copy code
fn hello(name: String) {
    println!("{}", param);
}

fn main() {
    let name = "Ariel";
    hello(name.clone());
    println!("{}", name); // Now it works, but you're using twice the memory for the content of the name variable.
}
And the last thing to highlight here is dealing with threads. The wonders and the hell of threads - you were happy with JavaScript's single thread, passing variables and functions back and forth without worrying, promising a lot to everyone, and asynchronicity solving everything. In Rust, if you want to do more than one thing at the same time, you'll need threads.

Right from the start, take a look at https://tokio.rs/, which will save you a lot of trouble. But working with threads is going to help you a lot more.

I started talking about WebAssembly, but I haven't even reached it yet, and indeed, as this project is only for local execution, no WebAssembly for now.

But I promise I'll say something about it.