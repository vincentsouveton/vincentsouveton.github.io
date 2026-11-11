---
title: Hamiltonian normalizing flows
date: 2026-11-08
tags: [normalizing flows, Hamiltonian dynamics, MCMC]
summary: >-
  How to build an invertible neural map out of Hamiltonian dynamics, why the
  Jacobian determinant disappears, how the idea extends to curved spaces such as the sphere,
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
  - authors: E. Mathieu, M. Nickel
    title: Riemannian continuous normalizing flows
    venue: NeurIPS, 2020
    links: [{ label: "arXiv:2006.10605", url: "https://arxiv.org/abs/2006.10605" }]
  - authors: M. Girolami, B. Calderhead
    title: Riemann manifold Langevin and Hamiltonian Monte Carlo methods
    venue: J. R. Stat. Soc. B 73(2):123–214, 2011
    links: [{ label: RePEc, url: "https://econpapers.repec.org/RePEc:bla:jorssb:v:73:y:2011:i:2:p:123-214" }]
  - authors: S. Byrne, M. Girolami
    title: Geodesic Monte Carlo on embedded manifolds
    venue: Scandinavian Journal of Statistics 40(4), 2013
    links: [{ label: "arXiv:1301.6064", url: "https://arxiv.org/abs/1301.6064" }]
  - authors: V. Souveton
    title: "Riemannian Neural Hamiltonian Flows: From Interpretable Potentials to Exact Surrogate Sampling"
    venue: arXiv preprint arXiv:2609.21647, 2026
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

The determinant is the costly part. For a generic map in dimension $$d$$ it costs $$\mathcal{O}(d^3)$$, so much of the work on flows goes into architectures that make it cheap: coupling layers, autoregressive maps, triangular Jacobians [[2]](#ref-2){:.cite}[[3]](#ref-3){:.cite}[[4]](#ref-4){:.cite}. Physics offers a different way out: use a map whose determinant is known to be exactly one.

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

The determinant of this transformation is exactly one. The inverse is the same scheme run with $$-\varepsilon$$. This is the integrator of Hamiltonian Monte Carlo [[5]](#ref-5){:.cite}.

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

## 4. Curved spaces: the sphere and the hyperbolic plane

Some data do not live in a flat space. Directions on the globe or in the sky live on the sphere $$\mathbb{S}^2$$; hierarchical data fit naturally in the hyperbolic plane $$\mathbb{H}^2$$, often drawn as the Poincaré disk. Both have non-zero curvature (positive for the sphere, negative for the hyperbolic plane), so a Euclidean flow followed by a projection loses track of volumes. Riemannian continuous normalizing flows [[10]](#ref-10){:.cite} handle such spaces, but they integrate an ODE and need the divergence of a vector field along the way.

Hamiltonian mechanics is geometric from the start, which makes it a natural fit. On a manifold $$\mathcal{M}$$ with metric $$g$$ (the matrix $$G(q)$$ in coordinates), the momentum $$p$$ is a covector at $$q$$ and the kinetic energy is given by the metric, as in Riemannian manifold HMC [[11]](#ref-11){:.cite}:

$$
H(q,p) = \tfrac12\, p^\top G(q)^{-1} p + V_\theta(q).
$$

The metric is not learned: it is the geometry of the space itself. As in the fixed-kinetic Euclidean case, the only learned object is the potential $$V_\theta$$. Without it, the particle follows geodesics: great circles on the sphere, arcs meeting the boundary at right angles in the Poincaré disk.

The integrator splits the Hamiltonian into these two parts, as in geodesic Monte Carlo [[12]](#ref-12){:.cite}: a kick by the potential, an exact geodesic drift, and a second kick. With step size $$h$$:

$$
\begin{aligned}
p_{n+1/2} &= p_n - \tfrac{h}{2}\, dV_\theta(q_n), \\
q_{n+1} &= \exp_{q_n}\!\big( h\, G(q_n)^{-1} p_{n+1/2} \big), \\
p_{n+1} &= \Gamma_{q_n \to q_{n+1}}\, p_{n+1/2} - \tfrac{h}{2}\, dV_\theta(q_{n+1}),
\end{aligned}
$$

where $$\exp_q$$ is the exponential map (follow the geodesic leaving $$q$$) and $$\Gamma$$ parallel-transports the momentum along it. Just like the leapfrog scheme, the whole step is symplectic so that the Jacobian determinant disappears again. On $$\mathbb{S}^2$$ and $$\mathbb{H}^2$$ the exponential map and parallel transport have closed forms; spaces without closed-form geodesics would need approximate symplectic integrators.

Training follows the "learning from data" case of section 3. The base draws positions from a simple density on the manifold (uniform on the sphere, a wrapped Gaussian on the hyperbolic plane) and momenta from a Gaussian $$\mathcal{N}_g(0, \sigma_p^2 I)$$ in the metric. A learned encoder $$q_\phi(p \mid q)$$ proposes momenta for each data point, and with $$(q_0,p_0) = \Phi_\theta^{-1}(q,p)$$ the lower bound reads

$$
\mathcal{L} = \mathbb{E}_{p \sim q_\phi(\cdot \mid q)} \Big[ \log \rho_0(q_0) + \log \mathcal{N}_g(p_0;\, 0, \sigma_p^2 I) - \log q_\phi(p \mid q) \Big].
$$

What I value most is that the learned potential can be read. A potential $$V$$ defines a profile $$\pi_V \propto e^{-V/\tau}$$ for a temperature $$\tau$$, and the matched potential $$V_\star = -\tau \log \rho_1$$ makes the target $$\rho_1$$ an equilibrium of the dynamics. Training does not force $$V_\theta = V_\star$$, but in practice the learned potential places its wells at the target modes. In the Gaussian case the flow is an exact rotation of phase space, which moves position information into momentum at a quarter period. On test problems on $$\mathbb{R}^2$$, $$\mathbb{H}^2$$ and $$\mathbb{S}^2$$, the model is competitive with a Riemannian continuous normalizing flow and cheaper per training step [[13]](#ref-13){:.cite}.

## 5. From flow to sampler: a surrogate for HMC

Hamiltonian Monte Carlo samples $$\pi$$ by setting $$U = -\log \pi$$, drawing a momentum, running $$L$$ leapfrog steps on $$H = U + K$$, and accepting the end point $$(q',p')$$ with probability

$$
\alpha = \min\Big\{ 1,\ \exp\big[ H(q,p) - H(q',p') \big] \Big\}.
$$

Every leapfrog step needs $$\nabla U$$. When $$\pi$$ involves an expensive forward model (a cosmological simulation, a PDE solve), these gradients dominate the cost.

The surrogate idea [[14]](#ref-14){:.cite}[[15]](#ref-15){:.cite}[[16]](#ref-16){:.cite} is to run the trajectory with a cheap approximation $$\tilde U$$, and to keep the exact $$U$$ only in the acceptance step. This remains exact: the leapfrog map built on $$\tilde U$$ is still reversible and volume-preserving, so the Metropolis correction with the true $$H$$ leaves $$\pi$$ invariant. The surrogate only affects how often proposals are accepted. Each proposal then costs $$L$$ cheap gradients and a single evaluation of $$U$$. Li et al. [[16]](#ref-16){:.cite} use a neural network as the surrogate, which brings us directly to the flows above.

A trained Hamiltonian flow provides such a surrogate. With a fixed kinetic energy, its potential $$V_\theta$$ is a cheap, differentiable function, learned so that Hamiltonian dynamics carries mass towards $$\pi$$. Plugged into the proposal, it keeps the chain exact; the closer it is to $$U$$ up to a constant, the higher the acceptance rate. The geodesic leapfrog of section 4 is reversible and volume-preserving as well, so the same recipe could give a surrogate for HMC on the sphere or the hyperbolic plane, in the spirit of geodesic Monte Carlo [[12]](#ref-12){:.cite}.

## 6. What we can take from this

Hamiltonian flows turn an engineering constraint (a cheap Jacobian) into a physical property (Liouville's theorem). What remains to learn has a meaning: a potential, whose wells show where the target puts its mass, on flat and curved spaces alike. Such learned interpretable potential then can be reused inside an exact gradient-based sampler.

> Choose the dynamics so that the hard part of the computation vanishes, and spend the network's capacity on the physics.
