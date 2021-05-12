# Exercise Session 13
## Q1 - R9
In what way does a hash provide a better message integrity check than a checksum (such as the internet checksum)?

A hash should change a lot when you change the input a little where as a if you wary the input a little in a checksum the output will only wary a little.

## Q2 - R10
Can you "decrypt" a hash of a message to get the original message? Explain your answer.

Hopefully not as you store passwords using a hash function. You can also take a very long message and put it in a hash of shorter length, then there is obviously not enough information to restore the message, unless you are trying to compress which is not the case.

## Q3 - R16
What is the purpose of a nonce in an end-point authentication protocol?

To make sure that you cannot do replay attacks.

## Q4 - P15
Consider our authentication protocol in Figure 8.18 in which Alice authenticates herself to Bob, which we saw works well (i.e., we found no flaws in  it). Now suppose that while Alice is authenticating herself to Bob, Bob must  authenticate himself to Alice. Give a scenario by which Trudy, pretending to  be Alice, can now authenticate herself to Bob as Alice. (Hint: Consider that  the sequence of operations of the protocol, one with Trudy initiating and one  with Bob initiating, can be arbitrarily interleaved. Pay particular attention to  the fact that both Bob and Alice will use a nonce, and that if care is not taken, the same nonce can be used maliciously.)

Trudy should be able to intercept both messages and work as a "router" getting every message and saving every message.

## Q5 - P18
Suppose Alice wants to send an e-mail to Bob. Bob has a public-private key pair $(K^+_B,K^-_B)$, and Alice has Bob's certificate. But Alice does no have a public, private key pair. Alice and Bob (and the entire world) share the same hash function $H(.)$.

1.  In this situation, is it possible to design a scheme so that Bob can verify that Alice created the message? If so, show how with a block diagram for Alice and Bob.

    Unless they create a symmetric key together it would seem that there is no way for Bob to send information to Alice without anybody else being able to see it as well.

2.  Is it possible to design a scheme that provides confidentiality for sending the message from Alice to Bob? If so, show how with a block diagram for Alice and Bob.

    She could encrypt the message with Bob's public key.

## Q6 - P23
When Bob signs a message, Bob must put something on the message that is unique to him. Bob coludconsider attaching a MAC for the signature, where the MAC is created by appending his key (unique to him) to the message, and then taking the hash. Will it cause any problem when Alice would try verification.

I suppose Alice verifies by checking if her hash aligns with the one she got, if does not have Bob key, she cannot check the hash.
