import { useState } from "react";
import { Button, Collapse, Form, InputGroup, OverlayTrigger, Spinner, Stack, Tooltip } from "react-bootstrap";
import toast from "react-hot-toast";
import CopyButton from "../../components/button/CopyButton";
import { local_storage } from "../../utils/functions";

type ReplaceAccessTokenT = {
  active: boolean,
  value: string,
  loading: boolean,
}

const TokenSetting = () => {
  const [currentToken, setCurrentToken] = useState<string>(local_storage.get("token") || "");
  const [replaceAccessToken, setReplaceAccessToken] = useState<ReplaceAccessTokenT>({
    active: false,
    value: "",
    loading: false,
  });

  const handleReplace = async () => {
    setReplaceAccessToken(p => ({ ...p, loading: true }));
    
    // setTimeout(() => {
    //   setReplaceAccessToken(p => ({ ...p, loading: false }));
    // }, 5000);
    toast("function's not ready yet, change it manually by going into localStorage, sorry uwu\"");
  };

  return (
    <>
      <OverlayTrigger placement="bottom-end" overlay={(p) => (
        <Tooltip id="accessTokenTooltipInfo" {...p}>
          This is your access token used for granting access
          to update/delete the notes you've created
        </Tooltip>
      )}>
        {({ ref, ...t }) => (
          <InputGroup {...t}>
            <Form.Control
              value={currentToken}
              readOnly
            />
            <Button
              size="sm"
              variant="outline-light"
              disabled={replaceAccessToken.loading}
              onClick={() => setReplaceAccessToken(p => ({ ...p, active: !p.active }))}
            ><i className={replaceAccessToken.active ? "bi bi-layers" : "bi bi-layers-half"} /></Button>
            <CopyButton size="sm" copy_value={local_storage.get("token")} />
            <Button size="sm" variant="outline-light" ref={ref}><i className="bi bi-question-lg" /></Button>
          </InputGroup>
        )}
      </OverlayTrigger>
      <Collapse in={replaceAccessToken.active}>
        <InputGroup className="mt-2">
          <Form.Control
            value={replaceAccessToken.value}
            onChange={e => setReplaceAccessToken(p => ({ ...p, value: e.target.value }))}
            placeholder="Replace token..."
            disabled={replaceAccessToken.loading}
          />
          <Button
            variant={replaceAccessToken.loading ? "success" : "outline-success"}
            disabled={replaceAccessToken.loading}
            onClick={handleReplace}
          >
            {
              replaceAccessToken.loading
                ? <Spinner size="sm" animation="border" />
                : <i className="bi bi-check-lg" />
            }
          </Button>
        </InputGroup>
      </Collapse>
      <Stack className="mt-2" direction="horizontal" gap={2}>
        <Button
          size="sm"
          variant="primary"
        >Check</Button>
        <Button
          size="sm"
          variant="success"
        >Combine</Button>
      </Stack>
    </>
  );
};

export default TokenSetting;
