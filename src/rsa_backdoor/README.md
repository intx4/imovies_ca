Just run `backdoor.sh`. It will generate:
- `pub_key.pem` being the public key with the backdoor
- `pvt_key.pem` being the private key.
- `nsa_key.txt` being the aes key.

It will use `klepto_v2.py`. The files are generated in `backupserver`.

Note that the runtime is quite long.

After this you can move to `backupserver/README.md`.