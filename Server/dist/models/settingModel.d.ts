export function getTakeOver(req: any, res: any): Promise<void>;
export function getTakeOverOne(req: any, res: any): Promise<any>;
export function updateTakeOver(seq: any, data: any): Promise<any>;
export function insertTakeOverLog(logData: any): Promise<any>;
export function takeOverProcess(applySeq: any, userInfo: any): Promise<any>;
export function getPolicyAdminList(req: any, res: any): Promise<void>;
export function checkPolicyRelation(data: any): Promise<any>;
export function insertPolicyAdmin(data: any): Promise<import("typeorm").InsertResult>;
export function deletePolicyAdmin(req: any, res: any): Promise<void>;
export function updatePolicyAdmin(req: any, res: any): Promise<number>;
export function getPolicyLimits(req: any, res: any): Promise<void>;
export function insertPolicyLimit(req: any, res: any): Promise<void>;
export function updatePolicyLimit(data: any, limitSeq: any, res: any): Promise<void>;
export function deletePolicyLimit(req: any, res: any): Promise<void>;
export function getDeviceList(req: any, res: any): Promise<void>;
export function getSmtpInfo(): Promise<any>;
export function insertSmtpInfo(smtp: any): Promise<import("typeorm").InsertResult>;
export function updateSmtpInfo(seq: any, smtp: any): Promise<import("typeorm").UpdateResult>;
export function getMailForm(req: any, res: any): Promise<void>;
export function getMailFormList(req: any, res: any): Promise<void>;
export function updateMailForm(mailFormSeq: any, data: any): Promise<import("typeorm").UpdateResult>;
export function getConfirmLineList(req: any, res: any): Promise<void>;
export function newConfirmLine(data: any): Promise<import("typeorm").InsertResult>;
export function deleteConfirmLine(req: any, res: any): Promise<void>;
export function moveApplies(data: any): Promise<import("typeorm").InsertResult>;
export function getDeviceInfo(req: any, res: any): Promise<void>;
export function getDevice(deviceSeq: any): Promise<any>;
export function insertDevice(data: any): Promise<import("typeorm").InsertResult>;
export function updateDevice(data: any, deviceSeq: any): Promise<import("typeorm").UpdateResult>;
export function deleteDevice(deviceSeq: any): Promise<any>;