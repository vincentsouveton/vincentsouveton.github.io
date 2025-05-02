---
layout: post
title: PIC Method for Vlasov-Poisson Equations
date: 2025-05-02
description: Simulating the Universe
tags:
categories:
---

As a scientist, I am deeply interested in the mathematical description and numerical simulation of physical systems, many of which are governed by Partial Differential Equations (PDEs). During my PhD, I encountered the **Vlasov-Poisson equations**, which describe the evolution of a collisionless system of massive particles under their own gravitational field. These equations are fundamental in modeling the large-scale structure formation of the universe, where dark matter is treated as a continuous distribution evolving in phase space. Note that the same formalism is also used in plasma physics for electrically charged particles.

### Vlasov Equation (Cosmological Context)

In cosmology, rather than tracking each particle individually as in $N$-body simulations,we describe the system through a **distribution function** $f(x, v, t)$, representing the density of particles in phase space:

<p>
$$
\frac{\partial f}{\partial t} + v \frac{\partial f}{\partial x} - \nabla \Phi(x, t) \frac{\partial f}{\partial v} = 0
$$
</p>

- $x$: spatial position  
- $v$: velocity  
- $\Phi(x, t)$: gravitational potential  

This is a Hamiltonian transport equation in phase space. It states that $$f$$ is conserved along particle trajectories. In cosmology, this equation governs the evolution of dark matter in the cold dark matter (CDM) approximation.

### Poisson Equation (Gravitational)

The gravitational potential $$\Phi(x, t)$$ from which the gravitational field derives satisfies Poisson's equation, sourced by the mass density:

<p>
$$
\nabla^2 \Phi(x, t) = 4\pi G \left[ \rho(x, t) - \bar{\rho} \right]
$$
</p>

where:

- $\rho(x, t) = m \int f(x, v, t) \, dv$  
- $m$: mass of individual particles  
- $\bar{\rho}$: average (background) density  
- $G$: gravitational constant  

Subtracting $\bar{\rho}$ ensures consistency with periodic boundary conditions in an expanding universe.

### Particle-In-Cell (PIC) Method for Cosmological Vlasov-Poisson

The **PIC method** provides an efficient way to numerically solve the Vlasov-Poisson system, particularly in the collisionless regime relevant for dark matter dynamics. The method scales efficiently to large numbers of particles and allows to captures nonlinear structure formation (e.g. filaments, halos). However, it introduces discreteness noise thus demanding careful choice of hyperparameters.

### PIC Steps (1D, Gravitational)

#### 1. Initialization

- Sample $N$ dark matter particles from an initial distribution $f(x, v, 0)$, typically derived from cosmological initial conditions.  
- Define a spatial grid with $N_x$ points and spacing $dx$.

#### 2. Mass Assignment

Deposit particle masses $m_p$ to the grid using **Cloud-In-Cell (CIC)** interpolation:

<p>
$$
\rho_i = \sum_p m_p \cdot S(x_i - x_p)
$$
</p>

Subtract background density $\bar{\rho}$ for cosmological consistency.

#### 3. Solve Poisson Equation

Use **Fast Fourier Transform** to solve:

<p>
$$
\frac{d^2 \Phi}{dx^2} = 4\pi G \left( \rho(x) - \bar{\rho} \right)  
\quad \Rightarrow \quad  
\hat{\Phi}(k) = -\frac{4\pi G}{k^2} \hat{\rho}(k)
$$
</p>

Compute gravitational field:

<p>
$$
\hat{a}(k) = -ik \hat{\Phi}(k)
$$
</p>

Inverse FFT yields $a(x) = -\nabla \Phi(x)$, the gravitational acceleration.

#### 4. Interpolate Force to Particles

Interpolate the gravitational acceleration $a(x)$ to particle positions using CIC.

#### 5. Advance Particles (Leapfrog Scheme)

- **Kick**: $v^{n+1/2} = v^n + a \cdot \frac{\Delta t}{2}$  
- **Drift**: $x^{n+1} = x^n + v^{n+1/2} \cdot \Delta t$
- **Kick**: $v^{n+1} = v^{n+1/2} + a \cdot \frac{\Delta t}{2}$

Apply **periodic boundary conditions**.

#### 6. Loop

Repeat steps 2 to 5 for each time step to evolve the system.


---

## References
- Birdsall & Langdon, *Plasma Physics via Computer Simulation*
- Hockney & Eastwood, *Computer Simulation Using Particles*
