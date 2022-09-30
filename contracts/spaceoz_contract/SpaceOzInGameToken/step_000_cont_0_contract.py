import smartpy as sp

class Contract(sp.Contract):
  def __init__(self):
    self.init_type(sp.TRecord(administrator = sp.TAddress, ledger = sp.TBigMap(sp.TPair(sp.TAddress, sp.TNat), sp.TNat), metadata = sp.TBigMap(sp.TString, sp.TBytes), next_token_id = sp.TNat, operators = sp.TBigMap(sp.TRecord(operator = sp.TAddress, owner = sp.TAddress, token_id = sp.TNat).layout(("owner", ("operator", "token_id"))), sp.TUnit), supply = sp.TBigMap(sp.TNat, sp.TNat), token_metadata = sp.TBigMap(sp.TNat, sp.TRecord(token_id = sp.TNat, token_info = sp.TMap(sp.TString, sp.TBytes)).layout(("token_id", "token_info")))).layout((("administrator", ("ledger", "metadata")), (("next_token_id", "operators"), ("supply", "token_metadata")))))
    self.init(administrator = sp.address('tz1QUYw77iqCsYUutxF511nhRhd1Z21YJKxU'),
              ledger = {(sp.address('tz1NLi5whLyUQFqry3o4QTKkStUASyiTBsPd'), 0) : 2000, (sp.address('tz1QUYw77iqCsYUutxF511nhRhd1Z21YJKxU'), 0) : 2000},
              metadata = {'' : sp.bytes('0x68747470733a2f2f6578616d706c652e636f6d')},
              next_token_id = 0,
              operators = {},
              supply = {0 : 2000},
              token_metadata = {0 : sp.record(token_id = 0, token_info = {'decimals' : sp.bytes('0x31'), 'name' : sp.bytes('0x53706163654f7a20546f6b656e'), 'price' : sp.bytes('0x050000'), 'symbol' : sp.bytes('0x5350434f5a'), 'url' : sp.bytes('0x')})})

  @sp.entry_point
  def balance_of(self, params):
    sp.set_type(params, sp.TRecord(callback = sp.TContract(sp.TList(sp.TRecord(balance = sp.TNat, request = sp.TRecord(owner = sp.TAddress, token_id = sp.TNat).layout(("owner", "token_id"))).layout(("request", "balance")))), requests = sp.TList(sp.TRecord(owner = sp.TAddress, token_id = sp.TNat).layout(("owner", "token_id")))).layout(("requests", "callback")))
    def f_x0(_x0):
      sp.verify(_x0.token_id < self.data.next_token_id, 'FA2_TOKEN_UNDEFINED')
      sp.result(sp.record(request = sp.record(owner = _x0.owner, token_id = _x0.token_id), balance = self.data.ledger.get((_x0.owner, _x0.token_id), default_value = 0)))
    sp.transfer(params.requests.map(sp.build_lambda(f_x0)), sp.tez(0), params.callback)

  @sp.entry_point
  def exchange(self, params):
    sp.verify((sp.sender == sp.sender) | (self.data.operators.contains(sp.record(owner = sp.sender, operator = sp.sender, token_id = 0))), 'FA2_NOT_OPERATOR')
    self.data.ledger[(sp.sender, 0)] = sp.as_nat(self.data.ledger.get((sp.sender, 0), default_value = 0) - params.amount, message = 'FA2_INSUFFICIENT_BALANCE')
    self.data.ledger[(sp.address('tz1QUYw77iqCsYUutxF511nhRhd1Z21YJKxU'), 0)] = self.data.ledger.get((sp.address('tz1QUYw77iqCsYUutxF511nhRhd1Z21YJKxU'), 0), default_value = 0) + params.amount
    sp.transfer(sp.record(to_ = sp.sender, token_id = params.token_id), sp.tez(0), sp.contract(sp.TRecord(to_ = sp.TAddress, token_id = sp.TNat).layout(("to_", "token_id")), params.inventory, entry_point='mint_existing').open_some())

  @sp.entry_point
  def mint(self, params):
    sp.verify(sp.sender == self.data.administrator, 'FA2_NOT_ADMIN')
    self.data.supply[0] += params.amount
    self.data.ledger[(params.to_, 0)] = self.data.ledger.get((params.to_, 0), default_value = 0) + params.amount

  @sp.entry_point
  def transfer(self, params):
    self.data.ledger[params.from_] = sp.as_nat(self.data.ledger.get(params.from_, default_value = 0) - params.tx.amount, message = 'FA2_INSUFFICIENT_BALANCE')
    self.data.ledger[params.tx.to_] = self.data.ledger.get(params.tx.to_, default_value = 0) + params.tx.amount

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