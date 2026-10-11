---
title: "Part 2: Shor's Algorithm in Plain English — The Math That Breaks the Internet's Trust Model"
description: "A no-equations explanation of what Shor's algorithm actually does — turning factoring into period-finding — why it breaks RSA and ECC, and why 'quantum computers are too slow today' misreads the threat model."
category: pqc
pubDate: 2026-07-09
author: "Col Gaurav Kumar Upadhyay (Retd)"
linkedin: "https://www.linkedin.com/pulse/part-2-shors-algorithm-plain-english-math-breaks-internets-trust-n6cqf"
readMinutes: 6
draft: false
---

_This is Part 2 of a 10-part series on Post-Quantum Cryptography for enterprise leaders._

In [Part 1](/insights/part-1-y2k-had-a-deadline-q-day-doesnt), I made a claim: the quantum threat to enterprise cryptography is real, it's already in motion through Harvest-Now-Decrypt-Later and the migration window is shorter than most leaders think. But I deliberately left the technical "why" unexplained.

Now let's open the hood. If you're a CISO, CTO or security architect, this is the post where you'll understand — without a single equation — exactly what Shor's algorithm does, why it breaks RSA and ECC and why the "quantum computers are too slow today" argument misses the point entirely.

## The lock that protects everything

Every time you initiate a TLS handshake, sign a certificate, authenticate an API call or verify a software update, you're relying on one mathematical assumption: that certain problems are so hard to solve that no computer can crack them in any practical timeframe.

For RSA, that problem is factoring — taking a large number (the product of two primes) and figuring out which two primes produced it. For ECC, it's a related problem on elliptic curves called the discrete logarithm problem.

Classical computers can't solve either of these efficiently. Not because nobody has tried, but because the best known classical algorithms slow down exponentially as the numbers get larger. A 2048-bit RSA key would take a classical supercomputer longer than the age of the universe to factor.

That's the lock. Every digital trust relationship you operate sits behind it.

## What Shor's algorithm actually does

In 1994, Peter Shor showed that a quantum computer could factor large numbers in polynomial time — not exponential. The difference isn't incremental. It's the difference between "longer than the universe" and "hours or days."

Here's the intuition, stripped of the math.

RSA's security relies on the fact that factoring is essentially a search problem — you're hunting for the right pair of primes in an astronomically large space. Classical computers search that space one path at a time. They're fast, but the space is too vast.

Shor's algorithm sidesteps the search entirely. It converts the factoring problem into a different question: finding the period of a mathematical function. Think of it as turning a needle-in-a-haystack search into a pattern-detection task. Classical computers are terrible at finding periods in exponentially large functions. Quantum computers, through a mechanism called the Quantum Fourier Transform, are extraordinarily efficient at it.

Once the period is found, extracting the prime factors becomes straightforward classical arithmetic. The quantum computer doesn't brute-force the lock. It transforms the lock into a different kind of problem — one it was specifically designed to solve.

## The N=15 example — small number, massive principle

When I built a quantum simulator to implement Shor's algorithm — work published in the Springer ICACCT 2015 proceedings — the demonstration used N=15, factoring it into 3 and 5. Trivial arithmetic for a human. But the point was never the answer — it was proving that the quantum approach works.

The algorithm picks a random number (say, a=7), computes the repeated powers of 7 mod 15, identifies the period (which turns out to be 4), and uses that period to extract the factors via the greatest common divisor. Every step that matters happens through quantum parallelism and interference — evaluating an exponential number of possibilities simultaneously, then collapsing them into the answer.

Scale that from 15 to a 2048-bit number, give the quantum computer enough stable qubits, and the same logic breaks RSA. Not by being faster at the same search. By never searching at all.

## "But quantum computers are too slow today"

This is the objection I hear most, and it fundamentally misunderstands the threat model.

Yes, today's quantum processors have hundreds to low thousands of noisy physical qubits. A cryptographically relevant quantum computer (CRQC) — one that could run Shor's against RSA-2048 — would need millions of physical qubits to produce the thousands of error-corrected logical qubits the algorithm requires. That gap is roughly three to four orders of magnitude. We're not there yet.

But this argument confuses "we can't do it today" with "we shouldn't prepare today." As I covered in [Part 1](/insights/part-1-y2k-had-a-deadline-q-day-doesnt), HNDL means the data exposure has already begun. And the history of quantum computing shows that progress isn't linear — it's punctuated by breakthroughs in error correction, qubit architecture, and fabrication that can compress timelines dramatically.

The question for an enterprise leader isn't "can someone run Shor's today?" It's "will my data still need to be confidential when someone can?" For most critical infrastructure, the answer is unambiguously yes.

## What this means for your systems

Shor's algorithm doesn't just threaten RSA. It breaks any cryptosystem whose security rests on factoring or discrete logarithm assumptions. That includes RSA key exchange, ECDSA signatures, ECDH key agreement, and DSA — the backbone of TLS, PKI, code signing, VPNs, and most certificate-based authentication in use today.

When a CRQC arrives, it won't target one application. It will invalidate a category of mathematics that underpins your entire trust architecture.

That's the stakes.

## Coming up next

Shor's gets the headlines, but there's a quieter quantum algorithm that affects an even broader set of systems. In [Part 3](/insights/part-3-grovers-algorithm-doubles-your-key-length), we'll cover Grover's algorithm — why it effectively halves the strength of your symmetric keys, and why calling it "just a speedup" dangerously undersells the operational impact.

---

_Col Gaurav Kumar Upadhyay (Retd) — published researcher in Shor's algorithm (Springer ICACCT 2015) and quantum random number generation (IEEE RTEICT 2016). 21+ years in enterprise cryptographic infrastructure._
