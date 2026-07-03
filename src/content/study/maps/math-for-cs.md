---
type: map
title: Mathematics for Computer Science
summary: Topic map of 6.042J concepts — EN with KO pairs.
---

# 🗺️ Mathematics for Computer Science (6.042J)

> Atomic concept nodes from MIT 6.042J. Each links to its English note; every note has a Korean pair (`.ko`). Course: <span class="wl-missing" title="not published">6.042J</span>.


## Proofs & Logic

- [Propositions, Predicates & Quantifiers](/portfolio/study/propositions-and-logic/) · _A proposition is a statement that is true or false; predicates add variables, and quantifiers (for-all, exists) bind them._  (L1)
- [Proof Methods](/portfolio/study/proof-methods/) · _Standard ways to prove a statement: direct, by cases, by contrapositive, and by contradiction._  (L1)
- [Mathematical Induction](/portfolio/study/induction/) · _Prove P(n) for all n by establishing a base case and that P(n) implies P(n+1)._  (L2)
- [Strong Induction](/portfolio/study/strong-induction/) · _An induction where the step may assume P holds for all values up to n, not just n itself._  (L3)
- [Well-Ordering Principle](/portfolio/study/well-ordering-principle/) · _Every nonempty set of nonnegative integers has a least element — a proof tool equivalent to induction._  (L3)
- [Invariants & State Machines](/portfolio/study/invariants-and-state-machines/) · _Model a process as states with transitions; a preserved invariant proves what the process can and cannot reach._  (L3)

## Number Theory

- [Divisibility, GCD & the Euclidean Algorithm](/portfolio/study/divisibility-and-gcd/) · _The gcd of two integers is computed by repeated remainders (Euclid), and is an integer combination of them (Bezout)._  (L4)
- [Modular Arithmetic](/portfolio/study/modular-arithmetic/) · _Arithmetic on remainders mod n; inverses exist when gcd with n is 1, and Fermat/Euler give fast exponentiation._  (L5)
- [RSA Public-Key Cryptography](/portfolio/study/rsa-cryptosystem/) · _Public-key encryption built on modular exponentiation; security rests on the hardness of factoring n=pq._  (L5)

## Graph Theory

- [Graphs: Walks, Paths & Connectivity](/portfolio/study/graphs-basics/) · _A graph is vertices joined by edges; walks, paths, cycles and connectivity describe how to move through it._  (L6)
- [Graph Coloring](/portfolio/study/graph-coloring/) · _Assign colors to vertices so adjacent ones differ; the minimum number needed is the chromatic number._  (L6,10)
- [Bipartite Matching & Hall's Theorem](/portfolio/study/bipartite-matching/) · _A matching pairs up vertices with no shared endpoints; Hall's condition tells exactly when one side can be fully matched._  (L7)
- [Trees & Spanning Trees](/portfolio/study/trees-and-spanning-trees/) · _A tree is a connected acyclic graph with n-1 edges; a spanning tree connects all vertices of a graph minimally._  (L8)
- [Planar Graphs & Euler's Formula](/portfolio/study/planar-graphs/) · _A planar graph can be drawn without crossings; vertices, edges and faces satisfy v - e + f = 2._  (L10)
- [Relations & Partial Orders](/portfolio/study/relations-and-partial-orders/) · _Binary relations classify by reflexivity/symmetry/transitivity; partial orders model dependency and enable scheduling._  (L11)

## Sums, Recurrences & Asymptotics

- [Sums & Summation Techniques](/portfolio/study/sums-and-techniques/) · _Evaluate and bound finite sums via arithmetic/geometric formulas, perturbation, and telescoping._  (L12)
- [Asymptotics & Integral Bounds](/portfolio/study/asymptotics-and-integral-bounds/) · _Big-O/Theta/Omega compare growth rates; sums are bounded by integrals, and Stirling approximates n!._  (L13)
- [Divide-and-Conquer Recurrences & Master Theorem](/portfolio/study/divide-and-conquer-recurrences/) · _Recurrences T(n)=aT(n/b)+f(n) are solved by recursion trees, summarized by the master theorem._  (L14)
- [Linear Recurrences](/portfolio/study/linear-recurrences/) · _Constant-coefficient recurrences solve via a characteristic equation plus a particular solution._  (L15)

## Counting

- [Counting: Sum, Product & Bijections](/portfolio/study/counting-principles/) · _Count by sum/product rules, permutations and combinations, or by a bijection to a set you can already count._  (L16)
- [Binomial Coefficients & Pascal's Triangle](/portfolio/study/binomial-coefficients/) · _C(n,k) counts k-subsets; the binomial theorem and Pascal's identity organize them._  (L16)
- [Pigeonhole Principle](/portfolio/study/pigeonhole-principle/) · _If n+1 items go into n boxes, some box holds two — a simple counting fact with surprising consequences._  (L17)
- [Inclusion–Exclusion](/portfolio/study/inclusion-exclusion/) · _Count a union by adding sets, subtracting pairwise overlaps, adding triples, and so on._  (L17)
- [Generating Functions](/portfolio/study/generating-functions/) · _Encode a sequence as the coefficients of a power series; algebra on the series solves counting and recurrences._  (L17)

## Probability

- [Probability: Sample Spaces & the Four-Step Method](/portfolio/study/probability-basics/) · _Model an experiment by a sample space and a probability on outcomes; the four-step method makes it systematic._  (L18)
- [Conditional Probability & Bayes' Theorem](/portfolio/study/conditional-probability-and-bayes/) · _Conditioning updates probability given information; Bayes reverses the conditioning direction._  (L19)
- [Independence](/portfolio/study/independence/) · _Events are independent when one's occurrence does not change the other's probability; mutual is stronger than pairwise._  (L20)
- [Random Variables & Distributions](/portfolio/study/random-variables/) · _A random variable maps outcomes to numbers; its distribution (PMF) lists the probability of each value._  (L21)
- [Expectation & Linearity](/portfolio/study/expectation/) · _The expected value is the probability-weighted average; expectation is linear even for dependent variables._  (L22,23)
- [Variance & Deviation Bounds](/portfolio/study/variance-and-deviation/) · _Variance measures spread; Markov and Chebyshev bound the chance a variable strays far from its mean._  (L24)
- [Random Walks & Gambler's Ruin](/portfolio/study/random-walks/) · _A walker takes random +/-1 steps; gambler's ruin computes the probability and duration before hitting a boundary._  (L25)

---
*Korean entry point:* each concept's Korean note is `<slug>.ko`.
