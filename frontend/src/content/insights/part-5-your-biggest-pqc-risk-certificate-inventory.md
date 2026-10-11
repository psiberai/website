---
title: "Part 5: Your Biggest PQC Risk Isn't Algorithms — It's Your Certificate Inventory"
description: "The uncomfortable truth after four posts of physics: PQC migration is roughly 20% algorithm selection and 80% certificate lifecycle management. You can't migrate cryptography you can't find — why discovery and crypto-agility are the real program."
category: pqc
pubDate: 2026-09-15
author: "Col Gaurav Kumar Upadhyay (Retd)"
linkedin: "https://www.linkedin.com/pulse/part-5-your-biggest-pqc-risk-isnt-algorithms-its-certificate-acwxf"
readMinutes: 7
draft: false
---

_This is Part 5 of a 10-part series on Post-Quantum Cryptography for enterprise leaders._

Four posts in and we've covered a lot of physics. [Shor's algorithm](/insights/part-2-shors-algorithm-in-plain-english) breaks RSA and ECC. [Grover's algorithm](/insights/part-3-grovers-algorithm-doubles-your-key-length) halves your symmetric key strength. [Regev's lattice constructions](/insights/part-4-lattices-not-magic-regevs-cryptography) give us mathematically well-founded replacements in ML-KEM and ML-DSA. If you've been following along, you now understand the threat and the defense better than most people writing about this topic.

Here's the uncomfortable truth I've been building toward since [Part 1](/insights/part-1-y2k-had-a-deadline-q-day-doesnt): none of that is where your PQC migration will actually succeed or fail.

The algorithm question is close to settled. NIST has published the standards. The math is sound. What isn't settled — for almost every enterprise I've encountered — is a far less glamorous question: where does your cryptography actually live?

## The thesis: 80/20 and the 80 isn't algorithms

I want to state this as plainly as I can, because it's the single most underestimated idea in enterprise PQC planning:

> Enterprise PQC migration is roughly 20% algorithm selection and 80% certificate lifecycle management.

Algorithm selection is the part everyone talks about — ML-KEM vs. Classic McEliece, lattice-based vs. code-based, performance benchmarks, key sizes. It's intellectually interesting, it's where the academic papers live and it's genuinely the smaller half of the problem.

The larger, quieter half is operational: finding every certificate, every key exchange, every TLS endpoint, every code-signing key, every embedded device credential, every third-party integration that depends on cryptography you don't fully control — and then having a system capable of rotating all of it, more than once, without breaking production.

Most enterprises can tell you which PQC algorithm they'd choose. Very few can tell you, with confidence, how many certificates they currently have in production, who owns each one, when each expires and what breaks if any single one fails to rotate cleanly.

## Why this gap exists

Certificate lifecycle management has historically been treated as IT hygiene, not strategic infrastructure. Certificates get issued by whoever needed one at the time — a developer standing up a new service, a vendor integration team, a legacy system nobody's touched since it was deployed. They live in different tools, different teams, different levels of documentation. Some are tracked in a CMDB. Many aren't tracked anywhere except the moment they expire and something breaks.

This was tolerable when certificate rotation was rare and low-stakes — swap an expiring cert, verify the service still starts, move on. PQC migration removes that tolerance entirely. You're not rotating one algorithm's keys once. You're potentially rotating everything, possibly more than once (hybrid classical-PQC schemes during transition, then pure PQC once trust in the new algorithms is fully established), across an inventory most organizations have never fully mapped.

An algorithm you haven't chosen yet is a research question. A certificate you don't know exists is a production outage waiting to happen mid-migration.

## What "crypto-agility" actually means

This is where the industry term "crypto-agility" earns its place — and where I think it's most often misunderstood. Crypto-agility isn't a feature you buy. It's an operational capability: the ability to change cryptographic algorithms, key sizes and protocols across your infrastructure without a multi-year re-architecture project each time.

Most enterprises don't have this capability today, because it was never load-bearing before. TLS 1.2 to 1.3 was largely a configuration change. RSA-2048 to RSA-3072, if it ever happened, was a parameter bump. Nothing in the last two decades has forced organizations to build genuine agility into how cryptography is deployed, tracked and rotated at scale.

PQC migration is the first event that makes crypto-agility non-optional. And building that capability — not selecting an algorithm — is the actual multi-year program.

## What discovery actually looks like

Before any migration roadmap makes sense, an enterprise needs a real answer to a deceptively simple question: what cryptography do we have and where?

In practice, this means:

- **Certificate discovery** across every network segment, cloud environment and endpoint — not just what's in your CA's issued-certificate list, but what's actually deployed and in use, including self-signed and unmanaged certificates that were never issued through a governed process.
- **Key inventory** across PKI, KMS, HSMs, code-signing infrastructure and embedded/IoT device credentials — often the least-visible category, and frequently the hardest to rotate without physical or logistical constraints.
- **Dependency mapping** — which applications, services and third-party integrations depend on which certificates and keys, so that rotation sequencing doesn't break production in ways nobody anticipated.
- **Ownership assignment** — every certificate needs a named owner accountable for its rotation, which sounds obvious and is almost never true in practice.

This is unglamorous work. It doesn't involve quantum mechanics. It's the kind of program that gets deprioritized in favor of "more strategic" initiatives — right up until it becomes the single largest risk in a PQC migration timeline.

## Why I lead with this, not the algorithms

Having spent years operating PKI, certificate lifecycle and TLS infrastructure at enterprise scale — not designing it on a whiteboard, but keeping it running under real operational constraints — this is the part of PQC migration I'd flag first to any Board or CISO asking where to start.

The algorithm conversation is important and we've spent four posts on it for good reason: you need to understand the threat and the destination clearly. But the organizations that succeed at PQC migration won't be the ones with the cleverest algorithm strategy. They'll be the ones who treated cryptographic inventory as a first-class infrastructure discipline before the migration deadline forced the issue.

## Coming up next

If discovery is the foundation, the next question is sequencing — you can't fix everything at once and not everything carries equal risk. In Part 6, we'll walk through a practical framework for prioritizing what to fix first: a Quantum Risk Register that weighs asset criticality, exposure window and migration complexity against each other, so the roadmap reflects actual risk rather than whatever's easiest to migrate first.

---

_Col Gaurav Kumar Upadhyay (Retd) — 21+ years operating PKI, certificate lifecycle management and TLS infrastructure at enterprise scale — the exact operational discipline that PQC migration now depends on._
