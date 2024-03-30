-- CreateEnum
CREATE TYPE "VerificationLevel" AS ENUM ('NotVerified', 'Pending', 'Level1', 'Level2');

-- CreateEnum
CREATE TYPE "BankInformationType" AS ENUM ('Pix', 'Iban');

-- CreateEnum
CREATE TYPE "AddressType" AS ENUM ('Residential', 'Work', 'Billing');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('Selfie', 'Id', 'DriverLicense', 'Passport', 'ProofOfAddress', 'Other');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('Pending', 'Received', 'Processed', 'Cancelled');

-- CreateEnum
CREATE TYPE "TokenStatus" AS ENUM ('Active', 'Inactive', 'Blocked');

-- CreateEnum
CREATE TYPE "TokenPurpose" AS ENUM ('EmailVerification');

-- CreateTable
CREATE TABLE "Customer" (
    "id" SERIAL NOT NULL,
    "cuid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "firstNameMother" TEXT NOT NULL DEFAULT '',
    "lastNameMother" TEXT NOT NULL DEFAULT '',
    "dateOfBirth" TIMESTAMP(3),
    "placeOfBirth" TEXT,
    "nationality" TEXT,
    "profession" TEXT,
    "cpfCnpj" TEXT NOT NULL,
    "phone1" TEXT NOT NULL,
    "phone2" TEXT,
    "email1" TEXT NOT NULL,
    "email2" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "verificationLevel" "VerificationLevel" NOT NULL DEFAULT 'NotVerified',
    "isInvited" BOOLEAN NOT NULL DEFAULT false,
    "isInBrazil" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankInformation" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "customerId" INTEGER NOT NULL,
    "type" "BankInformationType" NOT NULL,
    "identifier" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "BankInformation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TermsOfUseOnCustomer" (
    "customerId" INTEGER NOT NULL,
    "termsOfUseId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "accepted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "TermsOfUseOnCustomer_pkey" PRIMARY KEY ("customerId","termsOfUseId")
);

-- CreateTable
CREATE TABLE "TermsOfUse" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "url" TEXT NOT NULL,

    CONSTRAINT "TermsOfUse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlockchainAccount" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "customerId" INTEGER NOT NULL,
    "publicKey" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "rsAddress" TEXT NOT NULL,

    CONSTRAINT "BlockchainAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "customerId" INTEGER NOT NULL,
    "type" "AddressType" NOT NULL,
    "line1" TEXT NOT NULL,
    "line2" TEXT NOT NULL,
    "line3" TEXT NOT NULL,
    "line4" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postCodeZip" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "customerId" INTEGER NOT NULL,
    "type" "DocumentType" NOT NULL,
    "url" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationResult" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "customerId" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "validPII" BOOLEAN NOT NULL DEFAULT false,
    "isPoliticallyExposed" BOOLEAN NOT NULL DEFAULT false,
    "isLegallyRestricted" BOOLEAN NOT NULL DEFAULT false,
    "hasPendingProcesses" BOOLEAN NOT NULL DEFAULT false,
    "credibilityScore" INTEGER,
    "anualIncomeBRL" INTEGER,
    "hasDebts" BOOLEAN NOT NULL DEFAULT false,
    "isEligible" BOOLEAN NOT NULL DEFAULT false,
    "observations" TEXT,

    CONSTRAINT "VerificationResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "customerId" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "accountId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "usd" DECIMAL(65,30),
    "currency" TEXT,
    "poolId" TEXT NOT NULL,
    "tokenId" TEXT NOT NULL,
    "tokenQuantity" INTEGER NOT NULL,
    "transactionId" TEXT,
    "cancelTransactionId" TEXT,
    "status" "PaymentStatus" NOT NULL,
    "recordId" TEXT,
    "processedRecordId" TEXT,
    "cancelRecordId" TEXT,
    "observations" TEXT,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SecurityToken" (
    "id" SERIAL NOT NULL,
    "subjectId" TEXT NOT NULL,
    "purpose" "TokenPurpose" NOT NULL,
    "status" "TokenStatus" NOT NULL DEFAULT 'Active',
    "token" TEXT NOT NULL,
    "expiredAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "refreshCounter" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "SecurityToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Audit" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "method" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "payload" TEXT NOT NULL,
    "user" TEXT NOT NULL,

    CONSTRAINT "Audit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_cuid_key" ON "Customer"("cuid");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_cpfCnpj_key" ON "Customer"("cpfCnpj");

-- CreateIndex
CREATE INDEX "Customer_cuid_lastName_email1_cpfCnpj_idx" ON "Customer"("cuid", "lastName", "email1", "cpfCnpj");

-- CreateIndex
CREATE UNIQUE INDEX "BankInformation_identifier_key" ON "BankInformation"("identifier");

-- CreateIndex
CREATE INDEX "BankInformation_identifier_idx" ON "BankInformation"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "BlockchainAccount_publicKey_key" ON "BlockchainAccount"("publicKey");

-- CreateIndex
CREATE UNIQUE INDEX "BlockchainAccount_accountId_key" ON "BlockchainAccount"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "BlockchainAccount_rsAddress_key" ON "BlockchainAccount"("rsAddress");

-- CreateIndex
CREATE INDEX "BlockchainAccount_publicKey_accountId_rsAddress_idx" ON "BlockchainAccount"("publicKey", "accountId", "rsAddress");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationResult_customerId_key" ON "VerificationResult"("customerId");

-- CreateIndex
CREATE INDEX "Payment_accountId_poolId_tokenId_idx" ON "Payment"("accountId", "poolId", "tokenId");

-- CreateIndex
CREATE UNIQUE INDEX "SecurityToken_subjectId_purpose_key" ON "SecurityToken"("subjectId", "purpose");

-- CreateIndex
CREATE INDEX "Audit_method_url_idx" ON "Audit"("method", "url");

-- AddForeignKey
ALTER TABLE "BankInformation" ADD CONSTRAINT "BankInformation_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TermsOfUseOnCustomer" ADD CONSTRAINT "TermsOfUseOnCustomer_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TermsOfUseOnCustomer" ADD CONSTRAINT "TermsOfUseOnCustomer_termsOfUseId_fkey" FOREIGN KEY ("termsOfUseId") REFERENCES "TermsOfUse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockchainAccount" ADD CONSTRAINT "BlockchainAccount_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationResult" ADD CONSTRAINT "VerificationResult_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
