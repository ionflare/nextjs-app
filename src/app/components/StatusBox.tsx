import { APPSTATUS, useAppState } from './AppContext';

export function StatusBox() {
  const { appStatus } = useAppState();

  return (
    <div>{(appStatus == APPSTATUS.BUSY) ? "BUSY" : "READY"}</div>
  );
}