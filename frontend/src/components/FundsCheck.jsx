// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { Alert } from 'antd'
import { Link } from 'react-router-dom'

const FundsCheck = () => {
  return (
    <>
      {!window.HasBalance && (
        <div style={{ margin: '0 0 8px 0' }}>
          <Alert
            message='No Funds Available'
            description={
              <div>
                To interact with NuklaiNet, you need some funds in your account.
                You can request funds from the <Link to='/faucet'>Faucet</Link>.
              </div>
            }
            type='warning'
          />
        </div>
      )}
    </>
  )
}

export default FundsCheck
