import smartpy as sp

FA2_FUNGIBLE_MINIMAL = sp.io.import_template("fa2_fungible_minimal.py")

t_balance_of_args = sp.TRecord(
    requests=sp.TList(sp.TRecord(owner=sp.TAddress, token_id=sp.TNat)),
    callback=sp.TContract(
        sp.TList(
            sp.TRecord(
                request=sp.TRecord(owner=sp.TAddress, token_id=sp.TNat), balance=sp.TNat
            ).layout(("request", "balance"))
        )
    ),
).layout(("requests", "callback"))

class SpaceOzInGameToken(FA2_FUNGIBLE_MINIMAL.Fa2FungibleMinimal):
    def __init__(self, administrator, metadata_base, metadata_url):
        self.ledger_type = "SingleAsset"
        self.administrator = administrator
        FA2_FUNGIBLE_MINIMAL.Fa2FungibleMinimal.__init__(
            self,
            administrator=administrator,
            metadata_base=metadata_base,
            metadata_url=metadata_url,
        )
        self.update_initial_storage(
            ledger=sp.big_map(
                {
                    (sp.address("tz1QUYw77iqCsYUutxF511nhRhd1Z21YJKxU"), 0): 2000,
                    (sp.address("tz1NLi5whLyUQFqry3o4QTKkStUASyiTBsPd"), 0): 2000,
                },
                tkey=sp.TPair(sp.TAddress, sp.TNat),
                tvalue=sp.TNat,
            ),
            supply=sp.big_map(
                {
                    0: 2000,
                },
                tkey=sp.TNat,
                tvalue=sp.TNat,
                ),
            token_metadata=sp.big_map(
                {
                    0: sp.record(token_id=0, token_info=tok1_md),
                },
                tkey=sp.TNat,
                tvalue=sp.TRecord(
                    token_id=sp.TNat,
                    token_info=sp.TMap(sp.TString, sp.TBytes),
                ),
            ),
        )
    @sp.entry_point
    def mint(self, to_, amount):
        sp.verify(sp.sender == self.data.administrator, "FA2_NOT_ADMIN")
        self.data.supply[0] += amount
        self.data.ledger[(to_, 0)] = (
            self.data.ledger.get((to_, 0), 0) + amount
        )
    @sp.entry_point
    def transfer(self, from_, tx):
        self.data.ledger[from_] = sp.as_nat(
        self.data.ledger.get(from_, 0) - tx.amount,
        message="FA2_INSUFFICIENT_BALANCE",
    )
        # Do the transfer
        self.data.ledger[tx.to_] = self.data.ledger.get(tx.to_, 0) + tx.amount

    @sp.entry_point
    def exchange(self, inventory, amount, token_id):
            from_ = (sp.sender, 0)
            to_ = (self.administrator, 0)
            sp.verify(
                (sp.sender == sp.sender)
                | self.data.operators.contains(
                    sp.record(
                        owner=sp.sender,
                        operator=sp.sender,
                        token_id=0,
                    )
                ),
                "FA2_NOT_OPERATOR",
            )
            self.data.ledger[from_] = sp.as_nat(
                self.data.ledger.get(from_, 0) - amount,
                "FA2_INSUFFICIENT_BALANCE",
            )
            self.data.ledger[to_] = self.data.ledger.get(to_, 0) + amount
            c = sp.contract(sp.TRecord(to_=sp.TAddress, token_id=sp.TNat), inventory, entry_point='mint_existing').open_some()
            sp.transfer(sp.record(to_=sp.sender, token_id=token_id), sp.mutez(0), c)





class TheInventoryFA2(sp.Contract):
    """Class for a SpaceOz Invesntory FA2 NFT contract.

    Respects the FA2 standard.
    """

    def __init__(self, administrator, metadata_base, metadata_url, ingametoken):
        self.init(
            administrator=administrator,
            ledger=sp.big_map(tkey=sp.TNat, tvalue=sp.TSet(sp.TAddress)),
            metadata=sp.utils.metadata_of_url(metadata_url),
            next_token_id=sp.nat(1),
            operators=sp.big_map(
                tkey=sp.TRecord(
                    owner=sp.TAddress,
                    operator=sp.TAddress,
                    token_id=sp.TNat,
                ).layout(("owner", ("operator", "token_id"))),
                tvalue=sp.TUnit,
            ),
            token_metadata=sp.big_map(
                tkey=sp.TNat,
                tvalue=sp.TRecord(
                    token_id=sp.TNat,
                    token_info=sp.TMap(sp.TString, sp.TBytes),
                ),
            ),
        )
        metadata_base["views"] = [
            self.all_tokens,
            self.get_balance,
            self.is_operator,
            self.total_supply,
        ]
        self.init_metadata("metadata_base", metadata_base)
        self.ingametoken = ingametoken

    @sp.entry_point
    def transfer(self, batch):
        """Accept a list of transfer operations.

        Each transfer operation specifies a source: `from_` and a list
        of transactions. Each transaction specifies the destination: `to_`,
        the `token_id` and the `amount` to be transferred.

        Args:
            batch: List of transfer operations.
        Raises:
            `FA2_TOKEN_UNDEFINED`, `FA2_NOT_OPERATOR`, `FA2_INSUFFICIENT_BALANCE`
        """
        with sp.for_("transfer", batch) as transfer:
            with sp.for_("tx", transfer.txs) as tx:
                sp.set_type(
                    tx,
                    sp.TRecord(
                        to_=sp.TAddress, token_id=sp.TNat, amount=sp.TNat
                    ).layout(("to_", ("token_id", "amount"))),
                )
                sp.verify(tx.token_id < self.data.next_token_id, "FA2_TOKEN_UNDEFINED")
                sp.verify(
                    (transfer.from_ == sp.sender)
                    | self.data.operators.contains(
                        sp.record(
                            owner=transfer.from_,
                            operator=sp.sender,
                            token_id=tx.token_id,
                        )
                    ),
                    "FA2_NOT_OPERATOR",
                )
                with sp.if_(tx.amount > 0):
                    sp.verify(
                        (tx.amount == 1)
                        & (self.data.ledger[tx.token_id].contains(transfer.from_)),
                        "FA2_INSUFFICIENT_BALANCE",
                    )
                    self.data.ledger[tx.token_id].remove(transfer.from_) 
                    self.data.ledger[tx.token_id].add(tx.to_)

    @sp.entry_point
    def update_operators(self, actions):
        """Accept a list of variants to add or remove operators.

        Operators can perform transfer on behalf of the owner.
        Owner is a Tezos address which can hold tokens.

        Only the owner can change its operators.

        Args:
            actions: List of operator update actions.
        Raises:
            `FA2_NOT_OWNER`
        """
        with sp.for_("update", actions) as action:
            with action.match_cases() as arg:
                with arg.match("add_operator") as operator:
                    sp.verify(operator.owner == sp.sender, "FA2_NOT_OWNER")
                    self.data.operators[operator] = sp.unit
                with arg.match("remove_operator") as operator:
                    sp.verify(operator.owner == sp.sender, "FA2_NOT_OWNER")
                    del self.data.operators[operator]

    @sp.entry_point
    def balance_of(self, args):
        """Send the balance of multiple account / token pairs to a callback
        address.

        transfer 0 mutez to `callback` with corresponding response.

        Args:
            callback (contract): Where to callback the answer.
            requests: List of requested balances.
        Raises:
            `FA2_TOKEN_UNDEFINED`, `FA2_CALLBACK_NOT_FOUND`
        """

        def f_process_request(req):
            sp.verify(req.token_id < self.data.next_token_id, "FA2_TOKEN_UNDEFINED")
            sp.result(
                sp.record(
                    request=sp.record(owner=req.owner, token_id=req.token_id),
                    balance=sp.eif(
                        self.data.ledger[req.token_id].contains(req.owner), sp.nat(1), 0
                    ),
                )
            )

        sp.set_type(args, t_balance_of_args)
        sp.transfer(args.requests.map(f_process_request), sp.mutez(0), args.callback)

    @sp.entry_point
    def mint(self, to_, metadata):
        """(Admin only) Create a new token with an incremented id and assign
        it. to `to_`.

        Args:
            to_ (address): Receiver of the tokens.
            metadata (map of string bytes): Metadata of the token.
        Raises:
            `FA2_NOT_ADMIN`
        """
        sp.verify(sp.sender == self.data.administrator, "FA2_NOT_ADMIN")
        token_id = sp.compute(self.data.next_token_id)
        self.data.token_metadata[token_id] = sp.record(
            token_id=token_id, token_info=metadata
        )
        sp.if ~self.data.ledger.contains(token_id):
            self.data.ledger[token_id] = sp.set(l = [], t = sp.TAddress)
        self.data.ledger[token_id].add(to_)
        self.data.next_token_id += 1

    @sp.entry_point
    def mint_existing(self, params):
        """Mint an existing token with the given token_id and assign
        it. to `sp.sender`.

        Args:
            token_id (int): Id of the token.
        Raises:
            `FA2_TOKEN_UNDEFINED`, `ALREADY_OWNS_TOKEN`, `PRICE_DOESNOT_MATCH`
        """
        sp.verify(self.data.ledger.contains(params.token_id), "FA2_TOKEN_UNDEFINED")
        sp.verify(~self.data.ledger[params.token_id].contains(params.to_), "ALREADY_OWNS_TOKEN")
        sp.verify((sp.sender == self.ingametoken) | (sp.amount == sp.utils.nat_to_mutez(sp.unpack(self.data.token_metadata[params.token_id].token_info['price'], sp.TNat).open_some())), "PRICE_DOESNOT_MATCH")
        self.data.ledger[params.token_id].add(params.to_)

    @sp.offchain_view(pure=True)
    def all_tokens(self):
        """Return the list of all the `token_id` known to the contract."""
        sp.result(sp.range(0, self.data.next_token_id))

    @sp.offchain_view(pure=True)
    def get_balance(self, params):
        """Return the balance of an address for the specified `token_id`."""
        sp.set_type(
            params,
            sp.TRecord(owner=sp.TAddress, token_id=sp.TNat).layout(
                ("owner", "token_id")
            ),
        )
        sp.verify(self.data.ledger.contains(params.token_id), "FA2_TOKEN_UNDEFINED")
        sp.result(sp.eif(self.data.ledger[params.token_id].contains(params.owner), 1, 0))

    @sp.offchain_view(pure=True)
    def total_supply(self, params):
        """Return the total number of tokens for the given `token_id` if known
        or fail if not."""
        sp.verify(params.token_id <= self.data.next_token_id, "FA2_TOKEN_UNDEFINED")
        sp.result(1)

    @sp.offchain_view(pure=True)
    def is_operator(self, params):
        """Return whether `operator` is allowed to transfer `token_id` tokens
        owned by `owner`."""
        sp.result(self.data.operators.contains(params))
    









admin = sp.test_account("Administrator")
alice = sp.test_account("Alice")
bob = sp.test_account("Bob")

def make_metadata(symbol, name, decimals, price, url):
    """Helper function to build metadata JSON bytes values."""
    return sp.map(
        l={
            "decimals": sp.utils.bytes_of_string("%d" % decimals),
            "name": sp.utils.bytes_of_string(name),
            "symbol": sp.utils.bytes_of_string(symbol),
            "url": sp.utils.bytes_of_string(url),
            "price": sp.pack(price)
        }
    )

tok0_md = make_metadata(name="Laser Shot", decimals=0, symbol="BLT", price=5000000, url="https://i.imgur.com/SMkQOPA.png")
tok1_md = make_metadata(name="SpaceOz Token", decimals=1, symbol="SPCOZ", price=0, url="")

metadata_base = {
    "name": "The Inventory FA2 NFT",
    "version": "1.0.0",
    "description": "This is a minimal implementation of FA2 (TZIP-012) for the SpaceOZ Inventory using SmartPy.",
    "interfaces": ["TZIP-012", "TZIP-016"],
    "authors": ["Maadahv Sharma @Maadhav"],
    "homepage": "",
    "source": {
        "tools": ["SmartPy"],
        "location": "https://gitlab.com/SmartPy/smartpy/-/raw/master/python/templates/fa2_nft_minimal.py",
    },
    "permissions": {
        "operator": "owner-or-operator-transfer",
        "receiver": "owner-no-hook",
        "sender": "owner-no-hook",
    },
}

@sp.add_test(name="Test")
def test():
    sc = sp.test_scenario()

    igt = SpaceOzInGameToken(sp.address("tz1QUYw77iqCsYUutxF511nhRhd1Z21YJKxU"), metadata_base, "https://example.com")
    sc += igt
    fa2 = TheInventoryFA2(sp.address("tz1QUYw77iqCsYUutxF511nhRhd1Z21YJKxU"), metadata_base, "https://example.com", ingametoken=sp.address("KT1GFjj3DCzzqAGP8nnt9Hm3rMtqem4KBAFp"))
    sc += fa2

    sc.h2("Mint entrypoint")
    # Non admin cannot mint a new NFT token.
    sc.h3("NFT mint failure")
    fa2.mint(sp.record(metadata=tok0_md, to_=alice.address)).run(
        sender=alice, valid=False, exception="FA2_NOT_ADMIN"
    )

    sc.h3("Mint")
    # Mint of a new NFT token.
    fa2.mint(
            sp.record(metadata=tok0_md, to_=alice.address),
    ).run(sender=sp.address("tz1QUYw77iqCsYUutxF511nhRhd1Z21YJKxU"))

    # Mint an existing NFT token.
    fa2.mint_existing(sp.record(token_id=1, to_=bob.address)).run(sender=bob, amount=sp.mutez(5000000))

    # Check that the balance is updated.
    sc.verify(fa2.get_balance(sp.record(owner=alice.address, token_id=1)) == 1)
    # sc.verify(fa2.get_balance(sp.record(owner=bob.address, token_id=0)) == 1)

    # Check that the supply is updated.
    sc.verify(fa2.total_supply(sp.record(token_id=1)) == 1)

    sc.h3("Transfer")
    fa2.transfer(
            [
                sp.record(
                    from_=alice.address,
                    txs=[sp.record(to_=sp.address("tz1QUYw77iqCsYUutxF511nhRhd1Z21YJKxU"), amount=1, token_id=1)],
                ),
            ]
        ).run(sender=alice)

    igt.mint(sp.record(to_=alice.address, amount=100)).run(sender=sp.address("tz1QUYw77iqCsYUutxF511nhRhd1Z21YJKxU"))