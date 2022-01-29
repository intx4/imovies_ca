from Crypto.PublicKey import RSA
from Crypto.Cipher import AES
import random
import secrets
import base64 as b64
import string
import gmpy2
import math

SIZE = 1024
'''
Miller-Rabin primality test on n for k trials
'''
def miller_rabin(n, k=40):
    if n == 2:
        return True

    if n % 2 == 0:
        return False

    r, s = 0, n - 1
    while s % 2 == 0:
        r += 1
        s //= 2
    for _ in range(0,k):
        a = random.randrange(2, n - 1)
        x = pow(a, s, n)
        if x == 1 or x == n - 1:
            continue
        for _ in range(0, r - 1):
            x = pow(x, 2, n)
            if x == n - 1:
                break
        else:
            return False
    return True

'''
Generate Sophie Germain safe prime of l lenght such that phi(n) has 2,p,q as prime factors (easy to find coprimes)
'''
def generate_random_prime(l):
    is_prime = False
    while not is_prime:
        prime = secrets.randbits(l-1)
        is_prime = miller_rabin(prime)
        if is_prime:
            prime = 2*prime + 1
            is_prime = miller_rabin(prime)

    return prime

'''
Returns a backdoored public exponent e
'''
def generate_rsa_backdoor(p,key):
    cipher = AES.new(key, AES.MODE_ECB) 

    pt = p.to_bytes(SIZE//8, "big")
    ct = cipher.encrypt(pt)

    return int.from_bytes(ct, byteorder="big")

def generate_rsa_key():
    d = None
    p = generate_random_prime(SIZE//2)
    q = generate_random_prime(SIZE//2)
    n = p * q
    phi = (p-1)*(q-1)
    while d is None:
        key = ''.join(secrets.choice(string.ascii_lowercase) for _ in range(0,32)).encode('utf8')
        e = generate_rsa_backdoor(p,key)
        if e >= phi:
            continue
        try:
            d = gmpy2.invert(e,phi)
        except:
            continue
    print(key.decode('utf8'))
    print("Pub Key:\n")
    print(f"Modulus: {n}\n")
    print(f"Exponent: {e}\n")
    print("Private key:\n")
    print(f"d: {d}\n")
    print(f"p: {p}\n")
    print(f"q: {q}\n")
    return n,p,q,d,e,key

def backdoor(e,key):
    ct = e.to_bytes(SIZE//8, "big")
    cipher = AES.new(key, AES.MODE_ECB)
    pt = cipher.decrypt(ct)
    p = int.from_bytes(pt, "big")
    return p
'''
To use if e stores p
'''
def backdoor_p(n,e,key):
    p = backdoor(e,key)
    q = n//p
    print(p,q)
    phi = (p-1)*(q-1)
    d = gmpy2.invert(e, phi)
    return p,q,d

'''
If e stores phi
'''
def backdoor_phi(n,e,key):
    phi = backdoor(e,key)
    p = ((n+1-phi)*(-1) + math.sqrt(pow((n+1-phi),2) - 4*n))//2
    q = n // p
    d = gmpy2.invert(e, phi)
    return p,q,d

n,p,q,d,e,key = generate_rsa_key()
p_new,q_new,d_new = backdoor_p(n,e,key)

assert d == d_new
print("OK!")
material = (int(n),int(e))
RSA_key = RSA.construct(material)
with open('backdoor_key.pem', 'wb') as f:
    f.write(RSA_key.exportKey('PEM'))
material = (int(n), int(e), int(d), int(p), int(q))
RSA_key = RSA.construct(material)
with open('pvt_key.pem', 'wb') as f:
    f.write(RSA_key.exportKey('PEM'))

