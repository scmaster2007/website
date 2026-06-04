---
title: Notes on Neural Tangent Kernels
date: 2026-06-03
---

**Abstract/Intro:**

Q: "At initialization, artificial neural networks (ANNs) are equivalent to Gaussian processes in the infinite-width limit (16; 4; 7; 13; 6), thus connecting them to kernel methods" (first page). I don't really see how this connects to kernel methods in that Gaussian processes don't really have a specific non-linear equation that we can transform to higher dimensions.

A: A kernel function, for some $k(x,x')$ can measure the similarity between two inputs $x,x'$ in a high dimensional function space. For perceptrons it works as the way I described above because a kernel function as defined by the perceptron algorithm is given as $k(x,x') = \phi(x) * \phi (x')$, with $*$ being the dot product (calculates angle between the two lines, effectively measuring "similarity"). For Gaussian processes, it is unlike the general multiclass gaussian classification where we pick from some highest probability distribution given a point, but rather it models the likelihood of certain functions being mapped to a certain data distribution.

For example, say we have some points and we wish to find out the function that best describes the patterns, movements of these points to predict future points. The Gaussian Process will give us a distribution of functions, and we simply have to pick the function with the highest probability at that given time: the shape of this best function is given by the kernel, or $k(x,x')$$.

Q: " While the NTK is random at initialization and **varies during training**, in the infinite-width limit it converges to an explicit limiting kernel and it **stays constant during training.**" -> isn't this a contradiction

A: I didn't read the context of this correctly. While the NTK varies during training (kernel is constantly updating due to the addition of new points), the NTK converges and stays constant in the **infinite-width limit**.

Why is this useful.. because we can directly see the "function space" i.e. the space where we can see the gaussian processes and their choices of functions, we can derive new patterns from this new piece of information,,

Q: "In the limit as the widths of the hidden layers tend to infinity, the network function at initialization, fθ converges to a Gaussian distribution" -> is this because of the central limit theorem?

A: Yes.

### Section 2

Suppose we have some $0\dots L$ layers, each with $n_0 \dots n_L$ neurons. We wish to study the realization function, or the function that maps the parameters to functions in the function space $F$. So it can be defined as $F^L : R^{P} \rightarrow F$. The dimension of the parameter space is $\sum_{i\rightarrow L-1} (n_i * n_{i+1}) + n_i$ .

The authors split the network function $f_\theta$ into two parts: namely the preactivations $\alpha_l^{'}$ (the value of the function before the nonlinear transformation), and activations $\alpha_l$ (implicit in the name). Defined as: **Base Case:** $\alpha_0(x;\theta) = x$. **Preactivations**: $\alpha'_{l+1}(x;\theta) = \frac{1}{\sqrt n_l}(W_l * a_l(x;\theta)) + \beta b_l$. Essentially the value that goes into the next layer is equal to the weight of the previous layer times the value transformed of the previous layer plus the bias of the previous layer. **Activations**: $\alpha_l(x;\theta) = \sigma(\alpha'_l(x;\theta))$.

"First Remark:" The reasons for the existence of such constants $\frac{1}{\sqrt n_l}, \beta$ is to always guarantee an asymptotic behavior of neural networks (convergence).

**Section 3:**

We can train NNs by optimizing $f_\theta$ in the function space $\mathrm{F}$ given some functional cost that measures the cost of each specific function $f_\theta$ in $\mathrm{F}$, $\mathrm{C} : \mathrm{F} \rightarrow \mathbb{R}$. In order to do this, however, we have to take the composite cost (since $\mathrm{F}$ depends on $F^L$), which gives us $C \circ F :  \mathbb{R}^P \rightarrow \mathbb{R}$. This is a difficult equation to solve because its almost always nonconvex, even if the individual functions themselves are convex.

A multi-dimensional Kernel is some function that can take in $\mathbb{R}^{n_0 * n_0} \rightarrow \mathbb{R}^{n_L * n_L}$, this outputs some matrix, say $K$, where $K_{ij}$ maps the "similarity" between these two values. We can use this to our advantage to find the similarity between any $f(x), g(x')$ by calculating $\mathbb{E}[f(x)^T K(x,x') g(x')]$ (essentially $x^TMx$ but higher dimensional).
