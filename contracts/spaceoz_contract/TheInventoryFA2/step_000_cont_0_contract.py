import smartpy as sp

class Contract(sp.Contract):
  def __init__(self):
    self.init_type(sp.TRecord(administrator = sp.TAddress, ledger = sp.TBigMap(sp.TNat, sp.TSet(sp.TAddress)), metadata = sp.TBigMap(sp.TString, sp.TBytes), next_token_id = sp.TNat, operators = sp.TBigMap(sp.TRecord(operator = sp.TAddress, owner = sp.TAddress, token_id = sp.TNat).layout(("owner", ("operator", "token_id"))), sp.TUnit), token_metadata = sp.TBigMap(sp.TNat, sp.TRecord(token_id = sp.TNat, token_info = sp.TMap(sp.TString, sp.TBytes)).layout(("token_id", "token_info")))).layout((("administrator", ("ledger", "metadata")), ("next_token_id", ("operators", "token_metadata")))))
    self.init(administrator = sp.address('tz1QUYw77iqCsYUutxF511nhRhd1Z21YJKxU'),
              ledger = {},
              metadata = {'' : sp.bytes('0x68747470733a2f2f6578616d706c652e636f6d')},
              next_token_id = 1,
              operators = {},
              token_metadata = {})

  @sp.entry_point
  def balance_of(self, params):
    sp.set_type(params, sp.TRecord(callback = sp.TContract(sp.TList(sp.TRecord(balance = sp.TNat, request = sp.TRecord(owner = sp.TAddress, token_id = sp.TNat).layout(("owner", "token_id"))).layout(("request", "balance")))), requests = sp.TList(sp.TRecord(owner = sp.TAddress, token_id = sp.TNat).layout(("owner", "token_id")))).layout(("requests", "callback")))
    def f_x0(_x0):
      sp.verify(_x0.token_id < self.data.next_token_id, 'FA2_TOKEN_UNDEFINED')
      sp.result(sp.record(request = sp.record(owner = _x0.owner, token_id = _x0.token_id), balance = sp.eif(self.data.ledger[_x0.token_id].contains(_x0.owner), 1, 0)))
    sp.transfer(params.requests.map(sp.build_lambda(f_x0)), sp.tez(0), params.callback)

  @sp.entry_point
  def mint(self, params):
    sp.verify(sp.sender == self.data.administrator, 'FA2_NOT_ADMIN')
    compute_spacoz_contract_380i = sp.local("compute_spacoz_contract_380i", self.data.next_token_id)
    self.data.token_metadata[compute_spacoz_contract_380i.value] = sp.record(token_id = compute_spacoz_contract_380i.value, token_info = params.metadata)
    sp.if ~ (self.data.ledger.contains(compute_spacoz_contract_380i.value)):
      self.data.ledger[compute_spacoz_contract_380i.value] = sp.set_type_expr(sp.set([]), sp.TSet(sp.TAddress))
    self.data.ledger[compute_spacoz_contract_380i.value].add(params.to_)
    self.data.next_token_id += 1

  @sp.entry_point
  def mint_existing(self, params):
    sp.verify(self.data.ledger.contains(params.token_id), 'FA2_TOKEN_UNDEFINED')
    sp.verify(~ (self.data.ledger[params.token_id].contains(params.to_)), 'ALREADY_OWNS_TOKEN')
    sp.verify((sp.sender == sp.address('KT1GFjj3DCzzqAGP8nnt9Hm3rMtqem4KBAFp')) | (sp.amount == sp.mul(sp.set_type_expr(sp.unpack(self.data.token_metadata[params.token_id].token_info['price'], sp.TNat).open_some(), sp.TNat), sp.mutez(1))), 'PRICE_DOESNOT_MATCH')
    self.data.ledger[params.token_id].add(params.to_)

  @sp.entry_point
  def transfer(self, params):
    sp.for transfer in params:
      sp.for tx in transfer.txs:
        sp.set_type(tx, sp.TRecord(amount = sp.TNat, to_ = sp.TAddress, token_id = sp.TNat).layout(("to_", ("token_id", "amount"))))
        sp.verify(tx.token_id < self.data.next_token_id, 'FA2_TOKEN_UNDEFINED')
        sp.verify((transfer.from_ == sp.sender) | (self.data.operators.contains(sp.record(owner = transfer.from_, operator = sp.sender, token_id = tx.token_id))), 'FA2_NOT_OPERATOR')
        sp.if tx.amount > 0:
          sp.verify((tx.amount == 1) & (self.data.ledger[tx.token_id].contains(transfer.from_)), 'FA2_INSUFFICIENT_BALANCE')
          self.data.ledger[tx.token_id].remove(transfer.from_)
          self.data.ledger[tx.token_id].add(tx.to_)

  @sp.entry_point
  def update_operators(self, params):
    sp.for update in params:
      with update.match_cases() as arg:
        with arg.match('add_operator') as add_operator:
          sp.verify(add_operator.owner == sp.sender, 'FA2_NOT_OWNER')
          self.data.operators[add_operator] = sp.unit
        with arg.match('remove_operator') as remove_operator:
          sp.verify(remove_operator.owner == sp.sender, 'FA2_NOT_OWNER')
          del self.data.operators[remove_operator]


sp.add_compilation_target("test", Contract())