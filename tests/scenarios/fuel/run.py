import random
from utils import constrained_sum_sample_pos, arr_str


scenario_description = (
    "During the fueling period of the DAO, send enough ether from all "
    "accounts to purchase tokens and then assert that the user's balance is "
    "indeed correct and that the minimum fueling goal has been reached"
)


def run(ctx):
    ctx.assert_scenario_ran('deploy')

    sale_secs = ctx.remaining_time()
    ctx.total_supply = ctx.args.deploy_min_value + random.randint(1, 100)
    ctx.token_amounts = constrained_sum_sample_pos(
        len(ctx.accounts), ctx.total_supply
    )
    ctx.create_js_file(substitutions={
            "dao_abi": ctx.dao_abi,
            "dao_address": ctx.dao_addr,
            "wait_ms": (sale_secs-3)*1000,
            "amounts": arr_str(ctx.token_amounts)
        }
    )
    print(
        "Notice: Fueling period is {} seconds so the test will wait "
        "as much".format(sale_secs)
    )

    ctx.execute(expected={
        "dao_fueled": True,
        "total_supply": ctx.total_supply,
        "balances": ctx.token_amounts,
        "user0_after": ctx.token_amounts[0],
    })
