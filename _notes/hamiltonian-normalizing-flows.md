---
title: Hamiltonian normalizing flows
date: 2026-11-08
tags: [normalizing flows, Hamiltonian dynamics, MCMC]
summary: >-
  How to build an invertible neural map out of Hamiltonian dynamics, why the
  Jacobian determinant disappears, how the idea extends to curved geometries,
  and how the result can make Hamiltonian Monte Carlo cheaper.
references:
  - authors: D. J. Rezende, S. Mohamed
    title: Variational inference with normalizing flows
    venue: ICML, 2015
    links: [{ label: "arXiv:1505.05770", url: "https://arxiv.org/abs/1505.05770" }]
  - authors: L. Dinh, J. Sohl-Dickstein, S. Bengio
    title: Density estimation using Real NVP
    venue: ICLR, 2017
    links: [{ label: "arXiv:1605.08803", url: "https://arxiv.org/abs/1605.08803" }]
  - authors: I. Kobyzev, S. J. D. Prince, M. A. Brubaker
    title: "Normalizing flows: an introduction and review of current methods"
    venue: IEEE TPAMI, 2021
    links: [{ label: "arXiv:1908.09257", url: "https://arxiv.org/abs/1908.09257" }]
  - authors: G. Papamakarios, E. Nalisnick, D. J. Rezende, S. Mohamed, B. Lakshminarayanan
    title: Normalizing flows for probabilistic modeling and inference
    venue: JMLR 22(57), 2021
    links: [{ label: "arXiv:1912.02762", url: "https://arxiv.org/abs/1912.02762" }]
  - authors: R. M. Neal
    title: MCMC using Hamiltonian dynamics
    venue: Handbook of Markov Chain Monte Carlo, 2011
    links: [{ label: "arXiv:1206.1901", url: "https://arxiv.org/abs/1206.1901" }]
  - authors: P. Toth, D. J. Rezende, A. Jaegle, S. Racanière, A. Botev, I. Higgins
    title: Hamiltonian generative networks
    venue: ICLR, 2020
    links: [{ label: "arXiv:1909.13789", url: "https://arxiv.org/abs/1909.13789" }]
  - authors: D. J. Rezende, S. Racanière, I. Higgins, P. Toth
    title: Equivariant Hamiltonian flows
    venue: "2019"
    links: [{ label: "arXiv:1909.13739", url: "https://arxiv.org/abs/1909.13739" }]
  - authors: V. Souveton, A. Guillin, J. Jasche, G. Lavaux, M. Michel
    title: Fixed-kinetic neural Hamiltonian flows for enhanced interpretability and reduced complexity
    venue: AISTATS, PMLR 238, 2024
    links: [{ label: PMLR, url: "https://proceedings.mlr.press/v238/souveton24a.html" }]
  - authors: V. Souveton, S. Terrana
    title: "Hamiltonian normalizing flows as kinetic PDE solvers: application to the 1D Vlasov–Poisson equations"
    venue: ECAI workshop, PMLR 277, 2025
    links:
      - { label: PMLR, url: "https://proceedings.mlr.press/v277/souveton25a.html" }
      - { label: code, url: "https://github.com/vincentsouveton/PDE-NHF" }
  - authors: M. Girolami, B. Calderhead
    title: Riemann manifold Langevin and Hamiltonian Monte Carlo methods
    venue: J. R. Stat. Soc. B 73(2):123–214, 2011
    links: [{ label: RePEc, url: "https://econpapers.repec.org/RePEc:bla:jorssb:v:73:y:2011:i:2:p:123-214" }]
  - authors: V. Souveton
    title: "Riemannian neural Hamiltonian flows: geodesic symplectic transport and interpretability"
    venue: Preprint, 2026
    links:
      - { label: "arXiv:2609.21647", url: "https://arxiv.org/abs/2609.21647" }
      - { label: code, url: "https://github.com/vincentsouveton/RiemannianNHF" }
  - authors: C. E. Rasmussen
    title: Gaussian processes to speed up hybrid Monte Carlo for expensive Bayesian integrals
    venue: Bayesian Statistics 7, 2003
    links: [{ label: MPG, url: "https://ei.is.mpg.de/publications/2080" }]
  - authors: C. Zhang, B. Shahbaba, H. Zhao
    title: Hamiltonian Monte Carlo acceleration using surrogate functions with random bases
    venue: Statistics and Computing 27(6), 2017
    links: [{ label: "arXiv:1506.05555", url: "https://arxiv.org/abs/1506.05555" }]
  - authors: L. Li, A. Holbrook, B. Shahbaba, P. Baldi
    title: Neural network gradient Hamiltonian Monte Carlo
    venue: Computational Statistics 34(1), 2019
    links: [{ label: "arXiv:1711.05307", url: "https://arxiv.org/abs/1711.05307" }]
---

## 1. What a normalizing flow does, and what it costs

We often need a probability model that we can both *sample* and *evaluate*: draw new points, and compute their density. Two situations are typical. In density estimation we have samples of an unknown distribution and want a model of it. In Bayesian inference we know a target density $$\pi$$ only up to a constant, $$\tilde\pi \propto \pi$$, and want samples from it.

A normalizing flow handles both. Take a simple base density $$p_Z$$, such as a standard Gaussian, and an invertible map $$f_\theta$$. If $$z \sim p_Z$$, then $$x = f_\theta(z)$$ has the density given by the change-of-variables formula [[1]](#ref-1){:.cite}:

$$
\log p_X(x) = \log p_Z(z) - \log \left| \det \frac{\partial f_\theta}{\partial z}(z) \right| .
$$

The determinant is the bill. For a generic map in dimension $$d$$ it costs $$\mathcal{O}(d^3)$$, so much of the work on flows goes into architectures that make it cheap: coupling layers, autoregressive maps, triangular Jacobians [[2]](#ref-2){:.cite}[[3]](#ref-3){:.cite}[[4]](#ref-4){:.cite}. Physics offers a different way out: use a map whose determinant is known to be exactly one.

## 2. A particle in a landscape

Think of $$q \in \mathbb{R}^d$$ as the position of a particle moving on a surface whose height is a potential $$V(q)$$. Give the particle a momentum $$p \in \mathbb{R}^d$$ and a mass matrix $$M$$. Its total energy is

$$
H(q,p) = V(q) + K(p), \qquad K(p) = \tfrac12\, p^\top M^{-1} p ,
$$

and its motion obeys Hamilton's equations:

$$
\dot q = \nabla_p H = M^{-1} p, \qquad \dot p = -\nabla_q H = -\nabla V(q).
$$

The particle rolls down valleys, gains speed, climbs the next slope and slows down; energy is conserved along the way. Call $$\Phi_t$$ the map that sends a starting point $$(q_0,p_0)$$ to its position in phase space at time $$t$$. Two of its properties are exactly what a normalizing flow needs.

*It is invertible.* Running time backwards undoes the motion.

*It preserves volume.* This is Liouville's theorem: $$\det \nabla \Phi_t = 1$$. A cloud of particles can stretch and fold, but the phase-space volume it occupies never changes. A density on phase space is therefore simply carried along the trajectories, with no correction term:

$$
\rho_t\big(\Phi_t(q_0,p_0)\big) = \rho_0(q_0,p_0).
$$

Compared with the change-of-variables formula above, the log-determinant has vanished, and physics, not architecture design, removed it.

## 3. From equations to a network: the Euclidean case

"Euclidean" here means that the mass matrix $$M$$ is constant: the particle has the same inertia everywhere. To compute, we need a discrete version of $$\Phi_t$$ that keeps both properties. The leapfrog integrator does it. With step size $$\varepsilon$$:

$$
\begin{aligned}
p_{k+1/2} &= p_k - \tfrac{\varepsilon}{2}\, \nabla V(q_k), \\
q_{k+1} &= q_k + \varepsilon\, M^{-1} p_{k+1/2}, \\
p_{k+1} &= p_{k+1/2} - \tfrac{\varepsilon}{2}\, \nabla V(q_{k+1}).
\end{aligned}
$$

Each line changes one variable by an amount that depends only on the other. Such a map is a *shear*: its Jacobian is block-triangular with identity blocks on the diagonal, so its determinant is exactly one. The inverse is the same scheme run with $$-\varepsilon$$. This is the integrator of Hamiltonian Monte Carlo [[5]](#ref-5){:.cite}.

A neural Hamiltonian flow (NHF) [[6]](#ref-6){:.cite} makes the potential, and possibly the kinetic energy, learnable. The recipe has three steps:

1. Draw $$(q_0,p_0)$$ from a simple base density $$\rho_0$$, for instance $$\mathcal{N}(0,I) \otimes \mathcal{N}(0,M)$$.
2. Apply $$L$$ leapfrog steps with a neural potential $$V_\theta$$.
3. Keep $$q_L$$ as the sample. The density of the pair is known exactly: $$\log \rho_L(q_L,p_L) = \log \rho_0(q_0,p_0)$$.
{:.steps}

```python
def nhf_sample(V_theta, base, n, L, eps, M_inv):
    q, p = base.sample(n)              # (q0, p0) ~ rho_0
    log_rho = base.log_prob(q, p)      # exact, and it never changes
    for _ in range(L):                 # L leapfrog layers
        p = p - 0.5 * eps * grad(V_theta, q)
        q = q + eps * p @ M_inv
        p = p - 0.5 * eps * grad(V_theta, q)
    return q, p, log_rho               # no log-det term anywhere
```

How the model is trained depends on the situation. The momentum is an auxiliary variable: the model lives on $$(q,p)$$ while the quantity of interest is $$q$$ alone. Both cases use a distribution $$r(p \mid q)$$ over momenta, often simply $$\mathcal{N}(0,M)$$.

*Sampling a target known up to a constant.* We fit the flow to the extended target $$\pi(q)\, r(p \mid q)$$ by minimising the reverse Kullback–Leibler divergence. Since the density is transported unchanged, the loss reads

$$
\mathcal{L}(\theta) = \mathbb{E}_{(q_0,p_0) \sim \rho_0} \Big[ \log \rho_0(q_0,p_0) - \log \tilde\pi(q_L) - \log r(p_L \mid q_L) \Big] ,
$$

which only requires $$\log \tilde\pi$$ and back-propagation through the integrator.

*Learning from data.* For a data point $$x$$, draw $$p \sim r(\cdot \mid x)$$, integrate backwards to the base, and maximise the lower bound

$$
\log p(x) \;\geq\; \mathbb{E}_{p \sim r(\cdot \mid x)} \Big[ \log \rho_0\big(\Phi_L^{-1}(x, p)\big) - \log r(p \mid x) \Big].
$$

Two choices matter in practice. Toth et al. [[6]](#ref-6){:.cite} learn both $$V$$ and $$K$$; symmetries can also be built into the dynamics [[7]](#ref-7){:.cite}. In [[8]](#ref-8){:.cite} we fix $$K$$ to a quadratic form, which removes a network, reduces the number of parameters, and leaves $$V_\theta$$ as the only learned object, which makes it easier to interpret. The same structure also fits kinetic PDEs, whose characteristics are Hamiltonian: in [[9]](#ref-9){:.cite} we use it to solve the 1D Vlasov–Poisson system.

## 4. Curving the space: the Riemannian case

A constant mass matrix gives the particle the same inertia everywhere. Many targets do not have one scale: a posterior can be narrow in one region and wide in another, or bend along a curved ridge. With a fixed $$M$$, the step size must suit the hardest region, and many leapfrog layers are needed.

The remedy, borrowed from Riemannian manifold HMC [[10]](#ref-10){:.cite}, is to let the mass depend on position through a metric $$G(q)$$, a symmetric positive-definite matrix field:

$$
H(q,p) = V(q) + \tfrac12 \log\det G(q) + \tfrac12\, p^\top G(q)^{-1} p .
$$

Where $$G$$ is large the particle is heavy and moves slowly; where $$G$$ is small it moves fast. The geometry adapts locally to the target. Without the potential terms, the trajectories of $$H = \tfrac12 p^\top G(q)^{-1} p$$ are the geodesics of $$G$$: the particle follows the straight lines of a curved space.

The price is that $$H$$ no longer splits into a function of $$q$$ plus a function of $$p$$, so the explicit leapfrog no longer applies. The generalised leapfrog replaces it [[10]](#ref-10){:.cite}:

$$
\begin{aligned}
p_{k+1/2} &= p_k - \tfrac{\varepsilon}{2}\, \nabla_q H\big(q_k, p_{k+1/2}\big), \\
q_{k+1} &= q_k + \tfrac{\varepsilon}{2} \Big[ \nabla_p H\big(q_k, p_{k+1/2}\big) + \nabla_p H\big(q_{k+1}, p_{k+1/2}\big) \Big], \\
p_{k+1} &= p_{k+1/2} - \tfrac{\varepsilon}{2}\, \nabla_q H\big(q_{k+1}, p_{k+1/2}\big).
\end{aligned}
$$

The first two equations are implicit and are solved by a few fixed-point iterations. The scheme is still symplectic and reversible, so the determinant is still one and everything in section 3 carries over. What changes is what the network can learn: with a learnable metric $$G_\theta$$, the flow learns a geometry as well as a landscape, and the metric itself shows where the transport stretches or compresses space. This is the direction I study in [[11]](#ref-11){:.cite}.

## 5. From flow to sampler: a surrogate for HMC

Hamiltonian Monte Carlo samples $$\pi$$ by setting $$U = -\log \pi$$, drawing a momentum, running $$L$$ leapfrog steps on $$H = U + K$$, and accepting the end point $$(q',p')$$ with probability

$$
\alpha = \min\Big\{ 1,\ \exp\big[ H(q,p) - H(q',p') \big] \Big\}.
$$

Every leapfrog step needs $$\nabla U$$. When $$\pi$$ involves an expensive forward model (a cosmological simulation, a PDE solve), these gradients dominate the cost.

The surrogate idea [[12]](#ref-12){:.cite}[[13]](#ref-13){:.cite}[[14]](#ref-14){:.cite} is to run the trajectory with a cheap approximation $$\tilde U$$, and to keep the exact $$U$$ only in the acceptance step. This remains exact: the leapfrog map built on $$\tilde U$$ is still reversible and volume-preserving, so the Metropolis correction with the true $$H$$ leaves $$\pi$$ invariant. The surrogate only affects how often proposals are accepted. Each proposal then costs $$L$$ cheap gradients and a single evaluation of $$U$$. Li et al. [[14]](#ref-14){:.cite} use a neural network as the surrogate, which brings us directly to the flows above.

A trained Hamiltonian flow provides such a surrogate. With a fixed kinetic energy, its potential $$V_\theta$$ is a cheap, differentiable function, learned so that Hamiltonian dynamics carries mass towards $$\pi$$. Plugged into the proposal, it keeps the chain exact; the closer it is to $$U$$ up to a constant, the higher the acceptance rate. The Riemannian version could play the same role for Riemannian manifold HMC, where computing the metric is itself a large part of the cost.

## 6. What I take from this

Hamiltonian flows turn an engineering constraint (a cheap Jacobian) into a physical property (Liouville's theorem). What remains to learn has a meaning: a potential, and possibly a geometry. And because these flows use the same integrator as HMC, a model trained as a generator can be reused inside an exact sampler.

> Choose the dynamics so that the hard part of the computation vanishes, and spend the network's capacity on the physics.
