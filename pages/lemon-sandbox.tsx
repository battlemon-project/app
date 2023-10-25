import React, { useEffect, useState } from 'react';
import LemonSandboxScene from '../scenes/LemonSandboxScene';
import { useLemonStore } from '../helpers/lemonStore';
import { dummyLemon } from '../helpers/dummyLemon';

const LemonSandbox = () => {
  const { lemon } = useLemonStore(({ lemon }) => ({ lemon }));

  useEffect(() => {
    const dummy = dummyLemon();
    const _lemon = {
      id: '1',
      tokenId: '1',
      owner: '',
      image: '',
      type: '',
      url: '',
      properties: dummy.properties,
      items: dummy.items,
    }

    useLemonStore.setState({ lemon: _lemon });
  }, []);

  return <>{lemon && <LemonSandboxScene /> }</>;
};

export default LemonSandbox;
