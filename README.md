# CPSC-581-Project-1

on start, a timer counts down
the player gets three options:

they can press strike
they can press throw
or they can press neither for a few seconds to 'bait'.

on button-press, or after the timer runs out, the computer chooses a random move from three options:
block, throw, or reversal.

the player wins according to the following rules:
strike beats throw
throw beats block
bait beats reversal

the player ties according to the following rules:
strike ties block
throw ties throw
bait ties block

the player then according to the following:
bait loses to throw
strike *and* throw both lose to reversal

to compensate, reversals are rare - and when successfully predicted and beaten using bait, the player deals twice as much damage.

to win, the player must whittle down the enemy's health to zero
guessing wrong too many times can cause the player to lose as *their* health reaches zero.