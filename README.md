# IMovies Certificate Authority

Repo for the ETH Applied Security Lab 2021-2022 course semester project which I did in collaboration to some fellow colleagues.

## What it is all about

The project consisted in creating a Public Key Infrastracture for a fictional company named IMovies. The PKI consisted in a Certificate Authority which can issue certificates to IMovies employees to be later issued for secure email communications.
```
The (fictional) company iMovies produces independent movies of various kind
but with a focus on investigative reporting. Therefore, information exchanged
within the company and with informants must be handled confidentially.
To do so, iMovies wants to take its first steps towards PKI-based services.
For this reason, a simple certificate authority (CA) should be implemented, with
which employees can be provided with digital certificates. These certificates will
be used for secure e-mail communication.
``` 

In short, we had to implement both the PKI and a Full-Stack Web Application for interacting with the CA

## What we learned

This was a super fun project:

- First we learned how to design and deploy a realistic web application "in production" using python3 Flask framework + uWSGI for the backend and React.js for the frontend, and Nginx as a reverse proxy for serving the application.

- We also learned how a PKI would work in a realistic scenario and how to deploy that using best practices.

- We also had to secure the whole infrastructure applying well known security principles like "Defence-in-Depth" and network segmentation.

- Lastly we had to provide a technical review and risk analysis both of our system and of another system picked at random from another group of students (including a simple Penetration Test).

I had the opportunity to really look in depth in how TLS mutual authentication works, how the X509 format works and how to use OpenSSL to create a whole certificate authority. Additionally I could get my hands dirty with some full-stack developing and some system/ network administration for setting up and securing all the virtual machines involved in the system (it was a good way of getting to know Vagrant for easing the deployment of multiple VMs).

Also I got to implement 2 backdoors for the system, including a juicy crypto one :P