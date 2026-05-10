/**
 * Mock Store — حافظه مشترک برای همه mock repositoryها
 *
 * یک Map واحد برای هر aggregate — تمام repositoryها از اینجا می‌خوانند/می‌نویسند.
 * برای swap کردن با backend واقعی کافی است service-container را تغییر دهید.
 */
import { Project } from "@/domain/entities/project.entity";
import { ArchitectureModel } from "@/domain/entities/model.entity";
import { ModelElement } from "@/domain/entities/element.entity";
import { Relationship } from "@/domain/entities/relationship.entity";
import { Diagram } from "@/domain/entities/diagram.entity";
import { TraceLink } from "@/domain/entities/trace-link.entity";
import { User } from "@/domain/entities/user.entity";
import { Layer } from "@/domain/value-objects/layer.vo";
import { ElementType } from "@/domain/value-objects/element-type.vo";
import { RelationshipType } from "@/domain/value-objects/relationship-type.vo";
import { TraceLinkType } from "@/domain/value-objects/relationship-type.vo";
import { DiagramType } from "@/domain/value-objects/diagram-type.vo";

let _id = 100;
export function nextId(prefix = "mock"): string {
  return `${prefix}-${++_id}`;
}

// ─── Seed Users ──────────────────────────────────────────────────────────────

export const DEMO_USER = User.reconstitute({
  id: "user-demo",
  email: "demo@noqte.ir",
  name: "کاربر دمو",
  avatarUrl: null,
  createdAt: new Date("2024-01-01").toISOString(),
});

export const DEMO_PASSWORD = "demo1234";

// ─── Maps ────────────────────────────────────────────────────────────────────

export const users    = new Map<string, User>([[DEMO_USER.id, DEMO_USER]]);
export const projects = new Map<string, Project>();
export const models   = new Map<string, ArchitectureModel>();
export const elements = new Map<string, ModelElement>();
export const relationships = new Map<string, Relationship>();
export const diagrams = new Map<string, Diagram>();
export const traceLinks = new Map<string, TraceLink>();

// ─── Seed Data ───────────────────────────────────────────────────────────────

function seed() {
  // پروژه ۱ — سیستم کنترل پرواز
  const p1 = Project.reconstitute({
    id: "proj-1",
    name: "سیستم کنترل پرواز",
    description: "معماری سیستم کنترل پرواز خودکار برای پهپاد",
    ownerId: "user-demo",
    members: [{ userId: "user-demo", role: "OWNER", joinedAt: "2024-01-01T00:00:00.000Z" }],
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-06-01T00:00:00.000Z",
  });
  projects.set(p1.id, p1);

  // پروژه ۲ — سیستم بیمارستانی
  const p2 = Project.reconstitute({
    id: "proj-2",
    name: "سیستم مدیریت بیمارستان",
    description: "پلتفرم یکپارچه مدیریت بیمارستان با رویکرد معماری سرویس‌محور",
    ownerId: "user-demo",
    members: [{ userId: "user-demo", role: "OWNER", joinedAt: "2024-02-01T00:00:00.000Z" }],
    createdAt: "2024-02-01T00:00:00.000Z",
    updatedAt: "2024-07-01T00:00:00.000Z",
  });
  projects.set(p2.id, p2);

  // ─── Models برای پروژه ۱ ─────────────────────────────────────────────────

  const mOA = reconstitueModel({ id: "model-p1-oa", projectId: "proj-1", layer: Layer.OA, name: "OA — سیستم کنترل پرواز" });
  const mSA = reconstitueModel({ id: "model-p1-sa", projectId: "proj-1", layer: Layer.SA, name: "SA — سیستم کنترل پرواز" });
  const mLA = reconstitueModel({ id: "model-p1-la", projectId: "proj-1", layer: Layer.LA, name: "LA — سیستم کنترل پرواز" });
  [mOA, mSA, mLA].forEach((m) => models.set(m.id, m));

  // ─── Elements لایه OA ────────────────────────────────────────────────────
  const elPilot    = ModelElement.create({ id: "el-oa-1", modelId: "model-p1-oa", type: ElementType.from("OperationalActor"), name: "خلبان", description: "اپراتور سیستم" });
  const elMission  = ModelElement.create({ id: "el-oa-2", modelId: "model-p1-oa", type: ElementType.from("OperationalCapability"), name: "کنترل پرواز", description: "توانایی کلی کنترل مسیر پرواز" });
  const elNavigate = ModelElement.create({ id: "el-oa-3", modelId: "model-p1-oa", type: ElementType.from("OperationalActivity"), name: "ناوبری خودکار", description: "فعالیت ناوبری خودکار" });
  [elPilot, elMission, elNavigate].forEach((e) => elements.set(e.id, e));

  // ─── Elements لایه SA ────────────────────────────────────────────────────
  const elFCS  = ModelElement.create({ id: "el-sa-1", modelId: "model-p1-sa", type: ElementType.from("System"), name: "سیستم کنترل پرواز", description: "سیستم اصلی" });
  const elGPS  = ModelElement.create({ id: "el-sa-2", modelId: "model-p1-sa", type: ElementType.from("SystemComponent"), name: "ماژول GPS", description: "دریافت موقعیت" });
  const elIMU  = ModelElement.create({ id: "el-sa-3", modelId: "model-p1-sa", type: ElementType.from("SystemComponent"), name: "سنسور IMU", description: "اندازه‌گیری شتاب و زاویه" });
  [elFCS, elGPS, elIMU].forEach((e) => elements.set(e.id, e));

  // ─── Relationships OA ────────────────────────────────────────────────────
  const rel1 = Relationship.create({
    id: "rel-oa-1", modelId: "model-p1-oa",
    type: RelationshipType.from("InvolvementLink"),
    sourceElementId: "el-oa-1", targetElementId: "el-oa-2",
    name: "مشارکت در", description: "",
  });
  relationships.set(rel1.id, rel1);

  // ─── Diagrams ─────────────────────────────────────────────────────────────
  const diagOA = Diagram.create({ id: "diag-oa-1", modelId: "model-p1-oa", type: "OAB", name: "نمای کلی عملیاتی" });
  diagOA.placeElement("el-oa-1", { x: 80,  y: 100 });
  diagOA.placeElement("el-oa-2", { x: 350, y: 100 });
  diagOA.placeElement("el-oa-3", { x: 220, y: 280 });
  diagrams.set(diagOA.id, diagOA);

  const diagSA = Diagram.create({ id: "diag-sa-1", modelId: "model-p1-sa", type: "SAB", name: "معماری سیستم" });
  diagSA.placeElement("el-sa-1", { x: 80,  y: 80 });
  diagSA.placeElement("el-sa-2", { x: 350, y: 80 });
  diagSA.placeElement("el-sa-3", { x: 350, y: 250 });
  diagrams.set(diagSA.id, diagSA);

  // ─── TraceLinks OA→SA ─────────────────────────────────────────────────────
  const tl1 = TraceLink.create({
    id: "tl-1", projectId: "proj-1",
    type: TraceLinkType.Realization,
    sourceElementId: "el-oa-2", sourceLayer: Layer.OA,
    targetElementId: "el-sa-1", targetLayer: Layer.SA,
    description: "سیستم توانایی کنترل پرواز را Realize می‌کند",
  });
  traceLinks.set(tl1.id, tl1);
}

function reconstitueModel(p: { id: string; projectId: string; layer: Layer; name: string }): ArchitectureModel {
  return ArchitectureModel.reconstitute({
    id: p.id, projectId: p.projectId, layer: p.layer, name: p.name,
    description: "", createdAt: "2024-01-01T00:00:00.000Z", updatedAt: "2024-01-01T00:00:00.000Z",
  });
}

seed();
