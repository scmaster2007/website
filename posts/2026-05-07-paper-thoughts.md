---
title: some thoughts whilst i had thinking about our paper
date: 2026-05-07
---

## The Geometry of Thinking

This post is going to vary drastically from the other future posts that you are (hopefully) able to see well into the future (note the lack of capitalization in this post), but for now think of this respective entry as a way for me to get my thoughts out there. my website won't be public until the paper gets submitted into iclr, anyway, so its not like i'm breaking any rules of academic integrity here.

our paper is about something new that we've discovered, specifically regarding moo in rl. you can read the paper for yourself but essentially we've found an interesting **collapse phenomenon** that i don't think anyone has come across just yet. this collapse phenomenon is found within, safe to say, **ALL** policy gradient methods (at least thats what we can infer from the testing that we've done). thus, we highlight a new theoretical advance in the study of reinforcement learning compared to supervised learning as well as point out a desperate need for new, innovative MOO methods in RL (perhaps thats what we'll tackle next). there's a lot to get into with the theory that we haven't started, me and tao are hoping to get that started by mid may, but i'm going to get started tonight. we make a claim: first, that \pi\_\theta(x) = N(x; \theta, \sigma^2), and also say we have two rewards r_1(x) = -(x-1)^2, r_2(x) = -(x+1)^2. Then the combined reward becomes some R(x) = -(x-1)^2 + -(x+1)^2. this has one optimal point x=0, but we've seen that using per normalization on the advantage causes a weird bimodal split of the distribution, namely to two points -1 and 1, while the naive method converges to 0, the true global optimum. now all that is left is to prove why this is. ive ran a couple more tests that can be summarized into two camps: 1, testing in other simulations to determine if this is a behavior that is common everywhere in PG (spoiler: yes it is), and 2, adding more rewards to determine if this effect keeps happening. specifically we added r_3(x) = -1/2(x-0.5)^2, r_4(x) = 1/2(x+0.5)^2.

9:30pm. went out for a walk. thought of an interesting idea. told claude about it and told it to verify its authenticity: turns out i independently re-discovered curriculum learning, whch was done in 2009. great..

10:16pm. i just had a great idea. we plot these graphs on a number line. they are all 2d functions, but this reward function is 1d, meaning that it collapses from 2d to 1d. so during that transformation the points at which the respective graphs of the reward functions intersect when per normalization happens: must've biased each other out. i will do a simple average calculation and see if my estimates are correct. also i will attempt a new experiment running all three this time.

10:49pm. maybe its not the average. maybe its the optimum.. or how many points lie below that specific point at x... might need more complicated math for this, but i really don't want to do math with gradient flows right now..


