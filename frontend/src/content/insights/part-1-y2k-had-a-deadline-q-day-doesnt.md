---
title: "Part 1: Y2K Had a Deadline. Q-Day Doesn't — And That's the Problem"
description: "Why the absence of a Q-Day deadline is exactly what makes the quantum threat dangerous — harvest-now-decrypt-later, the '10–15 years' trap, and why enterprise PQC migration is 20% algorithms and 80% certificate infrastructure."
category: pqc
pubDate: 2026-07-07
author: "Col Gaurav Kumar Upadhyay (Retd)"
linkedin: "https://www.linkedin.com/pulse/part-1-y2k-had-deadline-q-day-doesnt-thats-problem-psiberai-smdbf"
readMinutes: 6
draft: false
---

_This is Part 1 of a 10-part series on Post-Quantum Cryptography for enterprise leaders._

Y2K gave us a date. A hard, unmovable line on a calendar. Every organisation on the planet knew when the clock would strike and that clarity — terrifying as it was — made it manageable. Budgets were approved. Programs were staffed. Deadlines were met.

The quantum threat to cryptography offers no such courtesy.

There is no announced date when a quantum computer will break RSA-2048 or crack elliptic curve cryptography. No vendor will send you a calendar invite for Q-Day. And that ambiguity is precisely what makes it dangerous — not because the threat is distant, but because the absence of a deadline lets organisations defer action indefinitely.

## The threat isn't tomorrow's quantum computer. It's today's encrypted traffic.

Here's the part that changes the math on urgency: adversaries don't need to wait for a cryptographically relevant quantum computer to start exploiting the quantum threat. They just need storage.

The strategy is called Harvest-Now-Decrypt-Later (HNDL). Nation-state actors and well-resourced adversaries are already intercepting and archiving encrypted communications — financial transactions, diplomatic cables, health records, intellectual property, classified data. The bet is simple: capture it today, decrypt it when the hardware catches up.

If the data you're protecting today needs to remain confidential for 10, 15, or 25 years — and in BFSI, healthcare, defense and critical infrastructure, it almost certainly does — then the effective exposure window isn't "when quantum computers arrive." It already opened.

That single reframe — from "when will quantum computers be ready" to "how long does my data need to stay secret" — is what separates organisations that are preparing from those that will be caught reacting.

## The "we have 10-15 years" trap

The most common response I hear from technology leaders is: "Credible estimates say 10-15 years before a cryptographically relevant quantum computer. We have time."

That statement has three problems.

**First, it assumes HNDL isn't happening.** It is. Intelligence agencies and security researchers have been flagging this for years. The exposure window is already open for long-lived data.

**Second, it ignores how long enterprise crypto migrations actually take.** Moving an organisation's cryptographic infrastructure — certificates, keys, protocols, integrations, vendor dependencies — is not a patch cycle. It's a multi-year program. The TLS 1.0 to 1.3 migration took many enterprises the better part of a decade and that was a version upgrade within the same cryptographic family. PQC migration is a fundamentally different class of change: new algorithms, new key sizes, new performance profiles, new certificate chains, new interoperability considerations.

**Third, it conflates "nobody has done it yet" with "it can't be done soon."** Quantum computing progress isn't linear. A single breakthrough in error correction, qubit stability, or architectural design could compress that 10-15 year estimate dramatically. Betting your security posture on the assumption that progress will be slow and predictable is not a risk strategy — it's a hope strategy.

## The standards are ready. The enterprises aren't.

Here's what has changed: the "migrate to what?" question is largely settled. NIST finalised its first set of post-quantum cryptographic standards in 2024 — ML-KEM for key encapsulation, ML-DSA for digital signatures, with SLH-DSA and others in the pipeline. The algorithms exist. The standards are published. The destination is defined.

What's missing is the journey. Most enterprises today don't have a complete inventory of where their cryptographic dependencies live — which certificates, which key exchanges, which protocols, in which systems, managed by whom, expiring when. That foundational visibility gap is the single biggest blocker to PQC readiness and it has nothing to do with quantum physics. It's a certificate lifecycle management problem.

This is a point I'll return to throughout this series, because it's the most underestimated dimension of the entire PQC conversation: enterprise PQC migration is roughly 20% algorithm selection and 80% cryptographic infrastructure management. The physics is the headline. The plumbing is the program.

## What's actually at stake

RSA and ECC don't just protect your web traffic. They underpin digital signatures, code signing, VPNs, API authentication, secure email, IoT device identity, payment processing, inter-bank settlement and virtually every trust relationship in modern digital infrastructure. When these algorithms become vulnerable — not if — the blast radius isn't a single system. It's the trust model itself.

That's not a technology problem you solve with a vendor purchase. It's a strategic transformation that requires discovery, prioritisation, architecture, migration and governance. And it starts now — not on Q-Day.

## Coming up next

In [Part 2](/insights/part-2-shors-algorithm-in-plain-english), we'll get into the algorithm that started this entire conversation: Shor's algorithm. What it actually does, why it breaks RSA and ECC and what it means practically for enterprise systems — explained without equations, for the people who have to make decisions about it.

---

_Col Gaurav Kumar Upadhyay (Retd) — 21+ years in cybersecurity and cryptographic infrastructure. Published researcher in Shor's algorithm and quantum random number generation. Hands-on experience with QKD integration, PKI and certificate lifecycle management at enterprise scale._
