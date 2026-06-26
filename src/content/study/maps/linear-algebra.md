---
type: map
title: Linear Algebra
summary: Topic map of 18.06 concepts — EN with KO pairs.
---

# 🗺️ Linear Algebra (18.06)

> Atomic concept nodes from MIT 18.06. Each links to its English note; every note has a Korean pair (`.ko`). Course: <span class="wl-missing" title="not published">18.06</span>.


## Foundations & Elimination

- [Three Pictures of Ax = b](/portfolio/study/linear-system-pictures/) · _A linear system has three views: rows (intersecting planes), columns (combination of column vectors), and the matrix form Ax=b._  (L1)
- [Gaussian Elimination](/portfolio/study/gaussian-elimination/) · _Systematic row operations that reduce A to upper-triangular form, then solve by back-substitution._  (L2)
- [Matrix Multiplication](/portfolio/study/matrix-multiplication/) · _The product AB, understood four equivalent ways: entry dot-products, columns, rows, and a sum of rank-one pieces._  (L3)
- [Matrix Inverse](/portfolio/study/matrix-inverse/) · _A^{-1} undoes A (AA^{-1}=I); it exists iff A is square with full rank, found by Gauss–Jordan._  (L3)
- [LU Factorization](/portfolio/study/lu-factorization/) · _Elimination written as A = LU: lower-triangular L (multipliers) times upper-triangular U (pivots)._  (L4)
- [Transpose & Permutation Matrices](/portfolio/study/transpose-and-permutations/) · _A^T swaps rows and columns; permutation matrices P reorder rows and handle pivoting (PA=LU)._  (L5)

## Vector Spaces & the Four Subspaces

- [Vector Space & Subspace](/portfolio/study/vector-space-and-subspace/) · _A set closed under addition and scalar multiplication; a subspace is such a set living inside another (must contain 0)._  (L5,6)
- [Column Space C(A)](/portfolio/study/column-space/) · _All linear combinations of A's columns — the set of b for which Ax=b is solvable._  (L6)
- [Nullspace N(A)](/portfolio/study/nullspace/) · _All solutions to Ax=0 — a subspace of R^n whose dimension is n − rank._  (L6,7)
- [Solving Ax = 0: Pivots, Free Variables, RREF](/portfolio/study/solving-ax-0/) · _Reduce A to RREF; pivot columns fix pivot variables, free columns give special solutions spanning the nullspace._  (L7)
- [Complete Solution of Ax = b](/portfolio/study/complete-solution-ax-b/) · _Every solution is x_particular + x_nullspace; solvable iff b∈C(A); the rank decides how many solutions._  (L8)
- [Rank](/portfolio/study/rank/) · _The number of pivots = dimension of the column space = number of independent rows/columns; it governs solvability._  (L7,8,9)
- [Independence, Basis, Dimension](/portfolio/study/independence-basis-dimension/) · _Independent vectors have only the trivial combination giving 0; a basis is an independent spanning set; its size is the dimension._  (L9)
- [The Four Fundamental Subspaces](/portfolio/study/four-fundamental-subspaces/) · _Every matrix has C(A), N(A), C(A^T), N(A^T) with dimensions r, n−r, r, m−r — and they pair up as orthogonal complements._  (L10)
- [Rank-One Matrices](/portfolio/study/rank-one-matrix/) · _The simplest nonzero matrices, A = uv^T; every rank-r matrix is a sum of r of them._  (L11)
- [Incidence Matrices (Graphs & Networks)](/portfolio/study/incidence-matrix/) · _A matrix encoding a graph (edges×nodes); its four subspaces are loops, potentials, and Kirchhoff's laws._  (L12)

## Orthogonality & Projections

- [Orthogonality & Orthogonal Complements](/portfolio/study/orthogonality/) · _Vectors are orthogonal when their dot product is 0; a subspace's orthogonal complement holds everything perpendicular to it._  (L14)
- [Projection onto a Subspace](/portfolio/study/projection/) · _The closest point in a subspace to b; given by the projection matrix P = A(A^TA)^{-1}A^T._  (L15)
- [Least Squares](/portfolio/study/least-squares/) · _Best-fit solution to an inconsistent Ax=b, found from the normal equations A^TA x̂ = A^Tb._  (L16)
- [Gram–Schmidt Orthogonalization](/portfolio/study/gram-schmidt/) · _Turn any independent set into an orthonormal one by subtracting projections, one vector at a time._  (L17)
- [QR Factorization](/portfolio/study/qr-factorization/) · _A = QR with Q orthonormal and R upper-triangular; the stable way to do least squares._  (L17)
- [Orthogonal Matrix](/portfolio/study/orthogonal-matrix/) · _A square matrix Q with orthonormal columns: Q^TQ=I, so Q^{-1}=Q^T; preserves lengths and angles._  (L17)

## Determinants

- [Determinant](/portfolio/study/determinant/) · _A single number det A that is 0 exactly when A is singular; equals signed volume and the product of pivots._  (L18)
- [Cofactor Expansion](/portfolio/study/cofactor-expansion/) · _Compute det A by expanding along a row/column using signed minors (cofactors)._  (L19)
- [Cramer's Rule & Volume](/portfolio/study/cramers-rule/) · _Solve Ax=b by ratios of determinants; det also measures volume scaling of the map A._  (L20)

## Eigenvalues & Diagonalization

- [Eigenvalues & Eigenvectors](/portfolio/study/eigenvalues-eigenvectors/) · _Directions x that A only scales: Ax=λx; found from det(A−λI)=0._  (L21)
- [Diagonalization & Powers of A](/portfolio/study/diagonalization/) · _If A has n independent eigenvectors, A = SΛS^{-1}, so A^k = SΛ^kS^{-1}._  (L22)
- [Matrix Exponential & Differential Equations](/portfolio/study/matrix-exponential/) · _Solve du/dt = Au with u(t)=e^{At}u(0); compute e^{At}=Se^{Λt}S^{-1}._  (L23)
- [Markov Matrices](/portfolio/study/markov-matrix/) · _Non-negative columns summing to 1; λ=1 is always an eigenvalue and its eigenvector is the steady state._  (L24)

## Special Matrices & Factorizations

- [Symmetric Matrices & the Spectral Theorem](/portfolio/study/symmetric-matrix/) · _A=A^T has real eigenvalues and orthonormal eigenvectors: A = QΛQ^T (spectral theorem)._  (L25)
- [Positive Definite Matrices](/portfolio/study/positive-definite/) · _Symmetric A with x^TAx>0 for all x≠0; equivalently all eigenvalues, pivots, and leading minors are positive._  (L25,27)
- [Complex Matrices & the FFT](/portfolio/study/complex-matrices-fft/) · _Hermitian/unitary generalize symmetric/orthogonal to ℂ; the Fourier matrix factors to give the O(n log n) FFT._  (L26)
- [Similar Matrices & Jordan Form](/portfolio/study/jordan-form/) · _Similar matrices B=M^{-1}AM share eigenvalues; the Jordan form is the canonical near-diagonal form when A can't be diagonalized._  (L28)
- [Singular Value Decomposition (SVD)](/portfolio/study/singular-value-decomposition/) · _Any matrix factors as A = UΣV^T with orthogonal U,V and nonnegative diagonal Σ; the master factorization._  (L29,31)
- [Pseudoinverse](/portfolio/study/pseudoinverse/) · _A^+ = VΣ^+U^T extends the inverse to any matrix; gives least-squares / minimum-norm solutions._  (L33)

## Linear Transformations

- [Linear Transformations](/portfolio/study/linear-transformation/) · _Maps T with T(cu+dv)=cT(u)+dT(v); once bases are chosen, every such map IS a matrix._  (L30)
- [Change of Basis](/portfolio/study/change-of-basis/) · _The same vector/map has different coordinates in different bases; related by B = M^{-1}AM._  (L31)

---
*Korean entry point:* each concept's Korean note is `<slug>.ko`.
