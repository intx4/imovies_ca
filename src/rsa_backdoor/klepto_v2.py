from Crypto.PublicKey import RSA
from Crypto.Cipher import AES
import random
import secrets
import base64 as b64
import string
import gmpy2
import math
import owiener

SIZE = 2048
'''
Miller-Rabin primality test on n for k trials (k 40)
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
Not needed now
'''
def generate_random_prime(l):
    is_prime = False
    while not is_prime:
        prime = secrets.randbits(l)
        is_prime = miller_rabin(prime)
        # if is_prime:
        #     prime = 2*prime + 1
        #     is_prime = miller_rabin(prime,20)
    return prime

'''
Returns a backdoored eps
'''
def generate_rsa_backdoor(phi,eps,key):
    pt = eps.to_bytes(SIZE//8, "big") #size in bytes
    cipher = AES.new(key, AES.MODE_ECB)
    ct = cipher.encrypt(pt)
    return int.from_bytes(ct, byteorder="big")
    
def generate_low_exponent(phi):
    # generate a low exponent delta and its inverse mod phi eps
    while True:
        delta = secrets.randbelow(2**256 - 1)
        if delta % 2 == 0:
           #must be odd
           continue
        try:
            eps = gmpy2.invert(int(delta), int(phi))
            break
        except: 
           #eps must be coprime with phi
           print(f"{delta} not invertible mod {phi}")
           continue
    return int(eps)

def generate_rsa_key():
    n = 0
    while len(bin(n)[2:]) < SIZE:
        d = None
        print("Generating primes...\n")
        p = generate_random_prime(SIZE//2)
        q = generate_random_prime(SIZE//2)
        n = p * q
    print(f"n is {str(SIZE)}\n")
    phi = (p-1)*(q-1)
    print("Generating backdoored key...\n")
    eps = generate_low_exponent(phi)
    while d is None:
        key = ''.join(secrets.choice(string.ascii_lowercase) for _ in range(0,16)).encode('utf8')
        #e = generate_rsa_backdoor(phi,eps,key)
        e = 65537
        secret = generate_rsa_backdoor(phi, eps, key)
        if e >= phi:
            continue
        if e % 2 == 0:
            continue
        if e % phi == 1:
            continue
        try:
            d =int(gmpy2.invert(int(e), int(phi)))
        except:
            continue
    print(key.decode('utf8'))
    print("------------Pub Key------------\n")
    print(f"Modulus: {n}\n")
    print(f"Exponent: {e}\n")
    print("------------Private Key----------\n")
    print(f"d: {d}\n")
    print(f"p: {p}\n")
    print(f"q: {q}\n")
    print("------------Backdoor----------\n")
    print(f"eps: {eps}")
    print(f"secret: {secret}")
    return n,p,q,d,e,secret,key.decode('utf8')

def split_using_lambda(n, s):
    """
    Given a composite n and and a multiple of lambda(n),
    return a non-trival factor of n.
    While raising a random base to
    phi (or lambda, which is lcm(p-1, q-1)), see if you get a non-trivial
    square root of 1 along the way. If so, take the gcd(n, square_root1 + 1)
    and that's a factor. If not, try another base.
    """
    # Divide factors of 2 out of exponent s
    while s & 1 == 0:
        s = s >> 1
    # Try bases until we find a factor
    for base in range(1, 999, 2):
    # Realy we should set base randomly, but this works
        a = pow(base, s, n)
        if a == 1:
            # Darn, we got to 1 without finding a square root
            continue
        # Keep squaring until we hit 1.
        while a != 1 and a != n-1:
            b = a
            a = pow(a,2,n)
        if a == 1:
            # Got it
            return math.gcd(n, b + 1)
        # Darn, the square root we found was -1.
    assert(0), "Something is very wrong."

"""
Get the eps from e
Recover delta by Wiener's low exponent attack (delta is small < l/4)
Once you have eps and delta, eps*delta - 1 = 0 mod(phi)
You can recover a factor of n by applying the squaring algo
"""
def wiener(secret,n,key):
    ct = secret.to_bytes(SIZE//8, "big")
    cipher = AES.new(key, AES.MODE_ECB)
    pt = cipher.decrypt(ct)
    eps = int.from_bytes(pt, "big")
    delta = owiener.attack(eps,n)
    if delta is None:
        print("FAILED WIENER")
        return
    else:
        s = eps*delta - 1
        p = split_using_lambda(n, s)
    return p

def backdoor(n,e,secret,key):
    p = wiener(secret,n,key)
    if p is None:
        print("ERROR!!\nSomething went wrong...please try run again")
        exit
    q = n//p
    print(f"Prime factors:\n{p}\n{q}\n Please compare with private key factors")
    phi = (p-1)*(q-1)
    d = int(gmpy2.invert(int(e), int(phi)))
    return p,q,d

if __name__ == '__main__':
    n,p,q,d,e,secret,key = generate_rsa_key()
    p_new,q_new,d_new = backdoor(n,e,secret,key)
    
    assert d == d_new
    print("OK!")

    material = (int(n),int(e))
    RSA_key = RSA.construct(material)
    with open('pub_key.pem', 'wb') as f:
        f.write(RSA_key.exportKey('PEM'))
    
    material = (int(n),int(e), int(d), int(p), int(q))
    RSA_key = RSA.construct(material)
    with open('pvt_key.pem', 'wb') as f:
        f.write(RSA_key.exportKey('PEM'))
    
    with open('nsa_key.txt', 'w') as f:
        f.write(f"Key: {key}")
        f.write(f" Secret: {str(secret)}")

