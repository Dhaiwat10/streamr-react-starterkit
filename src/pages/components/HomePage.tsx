import { useContext, useEffect, useState } from 'react';
import { useSigner } from 'wagmi';
import { AppContext } from '../_app';
import { getNewStreamrClient } from '../utils';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Stream } from 'streamr-client';

const HELSINKI_TRAM_STREAM_ID = 'streamr.eth/demos/helsinki-trams';

export default () => {
  const { data: signer } = useSigner();

  const { streamrClient, setStreamrClient } = useContext(AppContext);

  const [helsinkiStream, setHelsinkiStream] = useState<Stream>();
  const [helsinkiData, setHelsinkiData] = useState<any>([]);

  useEffect(() => {
    if (window.ethereum && signer) {
      const client = getNewStreamrClient();
      console.log('Streamr client created: ', client);
      setStreamrClient(client);
    }
  }, [window, signer]);

  useEffect(() => {
    (async () => {
      if (streamrClient) {
        const stream = await streamrClient.getStream(HELSINKI_TRAM_STREAM_ID);
        setHelsinkiStream(stream);
        streamrClient.subscribe(stream.id, (data: any) => {
          // make sure that the array is max 50 items long at any time
          setHelsinkiData((prevData: any) => {
            const newData = [...prevData, data];
            if (newData.length > 50) {
              newData.shift();
            }
            return newData;
          });
        });
      }
    })();
  }, [streamrClient]);

  return (
    <main>
      <ConnectButton />

      {helsinkiStream && (
        <div>
          <h1>Stream subscription demo - Helsinki Trams</h1>
          <p>Stream ID: {helsinkiStream.id}</p>

          <div style={{ height: '300px', overflow: 'scroll' }}>
            {helsinkiData.map((data: any) => (
              <pre>{JSON.stringify(data, null, 2)}</pre>
            ))}
          </div>
        </div>
      )}
    </main>
  );
};
