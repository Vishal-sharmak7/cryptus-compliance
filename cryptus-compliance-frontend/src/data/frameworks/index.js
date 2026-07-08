import iso27001 from "./iso27001.json";
import soc2 from "./soc2.json";
import gdpr from "./gdpr.json";
import pciDss from "./pciDss.json";
import hipaa from "./hipaa.json";
import dpdpa from "./dpdpa.json";
import cmmc from "./cmmc.json";
import nistCsf from "./nistCsf.json";

const frameworks = {
  "iso-27001": iso27001,
  "soc-2": soc2,
  "gdpr": gdpr,
  "pci-dss": pciDss,
  "hipaa": hipaa,
  "dpdpa": dpdpa,
  "cmmc": cmmc,
  "nist-csf": nistCsf,
};

export default frameworks;
